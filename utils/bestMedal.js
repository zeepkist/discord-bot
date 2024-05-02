import { MEDAL } from './medal.js';
export const bestMedal = (time, level, isWorldRecord) => {
    if (isWorldRecord)
        return MEDAL.WR;
    else if (!level.metadatumByMetadataId)
        return MEDAL.NONE;
    else if (time < level.metadatumByMetadataId.validation)
        return MEDAL.AUTHOR;
    else if (time < level.metadatumByMetadataId.gold)
        return MEDAL.GOLD;
    else if (time < level.metadatumByMetadataId.silver)
        return MEDAL.SILVER;
    else if (time < level.metadatumByMetadataId.bronze)
        return MEDAL.BRONZE;
    else
        return MEDAL.NONE;
};
