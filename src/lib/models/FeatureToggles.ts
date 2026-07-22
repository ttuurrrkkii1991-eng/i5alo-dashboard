import mongoose from 'mongoose';

const FeatureTogglesSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    features: {
        type: Map,
        of: Boolean,
        default: {}
    }
});

export default mongoose.models.FeatureToggles || mongoose.model('FeatureToggles', FeatureTogglesSchema);
