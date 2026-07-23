require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');

const schema = new mongoose.Schema({ html: String });
const Transcript = mongoose.models.Transcript || mongoose.model('Transcript', schema);

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const transcripts = await Transcript.find().lean();
    console.log("Found transcripts:", transcripts.map(t => t._id.toString()));
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
