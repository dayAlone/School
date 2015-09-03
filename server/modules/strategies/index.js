export default function() {
    return {
        local: require('./local')(),
        facebook: require('./facebook')(),
        vk: require('./vk')(),
    };
};
