/**
* This file must be required at least ONCE.
* After it's done, one can use require('mongoose')
*
* In web-app: this is done at init phase
* In tests: in mocha.opts
* In gulpfile: in beginning
*/

import mongoose from 'mongoose';
import config from 'config';
import models from '../models';

models();

mongoose
    .set('debug', false)
    .connect(config.mongoose.uri, config.mongoose.options);

export default mongoose;
