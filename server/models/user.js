import mongoose from 'mongoose';
import crypto from 'crypto';
import config from 'config';
import co from 'co';
import transliterate from '../libs/textUtil/transliterate';

const ProviderSchema = new mongoose.Schema({
    name: String,
    nameId:  {
        type:  String,
        index: true
    },
    profile: {} // updates just fine if I replace it with a new value, w/o going inside
});

const userSchema = new mongoose.Schema({
    displayName:   {
        type:     String,
        default:  ''
    },
    profileName:   {
        type:     String,
        validate: [
            {
                validator: function(value) {
                    // also checks required
                    if (this.deleted) return true;
                    return value && value.length >= 2;
                },
                msg: 'Минимальная длина имени профиля: 2 символа.'
            },
            {
                validator: function(value) {
                    return this.deleted || /^[a-z0-9-]*$/.test(value);
                },
                msg: 'В имени профиля допустимы только буквы a-z, цифры и дефис.'
            },
            {
                validator: function(value) {
                    // if no value, this validator passes (another one triggers the error)
                    return this.deleted || !value || value.length <= 64;
                },
                msg: 'Максимальная длина имени профиля: 64 символа.'
            }
        ],
        index: {
            unique: true,
            sparse: true,
            errorMessage: 'Такое имя профиля уже используется.'
        }
    },
    email:         {
        type:     String,
        unique:   true,
        required: 'E-mail пользователя не должен быть пустым.',
        validate: [
            {
                validator: function checkNonEmpty(value) {
                    return this.deleted ? true : (value.length > 0);
                },
                msg: 'E-mail пользователя не должен быть пустым.'
            },{
                validator: function checkEmail(value) {
                    return this.deleted ? true : /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
                },
                msg: 'Укажите, пожалуйста, корректный email.'
            }
        ]
    },
    passwordHash: {
        type: String
    },
    salt: {
        type: String
    },
    providers: [ProviderSchema],
    gender: {
        type: String,
        enum: {
            values:  ['male', 'female'],
            message: 'Неизвестное значение для пола.'
        }
    },
    realName:      String,
    birthday:      String,
    photo:         String, // imgur photo link
    country:       String,
    town:          String,
    verifiedEmail: {
        type:    Boolean,
        default: false
    },
    verifyEmailToken: {
        type:  String,
        index: true
    },
    verifyEmailRedirect: String, // where to redirect after verify
    passwordResetToken: {  // refresh with each recovery request
        type:  String,
        index: true
    },
    passwordResetTokenExpires: Date, // valid until this date
    passwordResetRedirect:     String, // where to redirect after password recovery
    created: {
        type: Date,
        default: Date.now
    }
});

userSchema.virtual('password')
    .set(function(password) {

        if (password !== undefined) {
            if (password.length < 4) {
                this.invalidate('password', 'Пароль должен быть минимум 4 символа.');
            }
        }

        this._plainPassword = password;

        if (password) {
            this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length);
        } else {
            // remove password (unable to login w/ password any more, but can use providers)
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })
    .get(function() {
        return this._plainPassword;
    });

userSchema.methods.generateProfileName = function* () {
    var profileName = this.displayName.trim()
        .replace(/<\/?[a-z].*?>/gim, '')  // strip tags, leave /<DIGIT/ like: 'IE<123'
        .replace(/[ \t\n!'#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/g, '-') // пунктуация, пробелы -> дефис
        .replace(/[^a-zа-яё0-9-]/gi, '') // убрать любые символы, кроме [слов цифр дефиса])
        .replace(/-+/gi, '-') // слить дефисы вместе
        .replace(/^-|-$/g, ''); // убрать дефисы с концов

    profileName = transliterate(profileName);
    profileName = profileName.toLowerCase();

    var existingUser;
    while (true) {
        existingUser = yield User.findOne({profileName: profileName}).exec();

        if (!existingUser) break;
        // add one more random digit and retry the search
        profileName += Math.random() * 10 ^ 0;
    }

    this.profileName = profileName;
};

userSchema.pre('save', function(next) {
    if (this.deleted || this.profileName) return next();

    co(function*() {
        yield* this.generateProfileName();
    }.bind(this)).then(next, next);
});

userSchema.methods.checkPassword = function(password) {
    if (!password) return false; // empty password means no login by password
    if (!this.passwordHash) return false; // this user does not have password (the line below would hang!)

    return crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length) == this.passwordHash;
};

const User = mongoose.model('User', userSchema);
export default User;
