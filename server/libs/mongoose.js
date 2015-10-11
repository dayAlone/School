import mongoose from 'mongoose';
import config from 'config';
import initModels from '../models';

initModels();

mongoose
    .set('debug', false)
    .connect(config.mongoose.uri, config.mongoose.options);

export default mongoose;
