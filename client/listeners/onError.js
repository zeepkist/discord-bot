import { log } from '../../utils/index.js';
export const onError = (error) => {
    log.error(error.message);
};
