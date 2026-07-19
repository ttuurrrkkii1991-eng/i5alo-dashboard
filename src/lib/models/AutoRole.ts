import mongoose from 'mongoose';

const AutoRoleSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    humanRoles: [{ type: String }], // Array of Role IDs
    botRoles: [{ type: String }] // Array of Role IDs
});

export default mongoose.models.AutoRole || mongoose.model('AutoRole', AutoRoleSchema);
