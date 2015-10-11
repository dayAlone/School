import path from 'path';
import { deferConfig as defer } from 'config/defer';

const url = process.env.NODE_ENV === 'production' ? 'http://testkoa.herokuapp.com': 'http://localhost:3000';

export default {
    __dirname: defer(function(cfg) {
            return cfg.root;
    }),
    // secret data can be moved to env variables
    // or a separate config
    secret:   'mysecret',
    expires: 60 * 60 * 24,
    mongoose: {
        uri:     process.env.NODE_ENV === 'production' ? process.env.MONGOLAB_URI : 'mongodb://localhost/testReact',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                },
                poolSize: 5
            }
        }
    },
    crypto: {
        hash: {
            length: 128,
            // may be slow(!): iterations = 12000 take ~60ms to generate strong password
            iterations: process.env.NODE_ENV === 'production' ? 12000 : 1
        }
    },
    '/': defer(function(cfg) {
        return cfg.root;
    }),
    template: {
        // template.root uses config.root
        root: defer(function(cfg) {
            return path.join(cfg.root, 'client/templates');
        })
    },
    facebook: {
        client: {
            id: '1547174235496273',
            secret: '81a124c43663e258887c6b0f3b0ee642'
        },
        callback: {
            url: url + '/auth/facebook/callback'
        }
    },
    vk: {
        client: {
            id: '4599838',
            secret: 'me1pxHVbIf1KDEfqzvbg'
        },
        callback: {
            url: url + '/auth/vk/callback'
        }
    },
    root: process.cwd()
};
