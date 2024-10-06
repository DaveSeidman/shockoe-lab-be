const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Entry = require('./src/models/Entry');
const Type = require('./src/models/Type');
const Tag = require('./src/models/Tag');
const seedData = require('./seed-data.json');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Seed Users
    await Promise.all(seedData.users.map(async (userData) => {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const newUser = new User(userData);
        await newUser.save();
        console.log(`User seeded: ${newUser.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }));

    // Seed Types
    const types = await Promise.all(seedData.types.map(async (typeData) => {
      let existingType = await Type.findOne({ name: typeData.name });
      if (!existingType) {
        existingType = new Type(typeData);
        await existingType.save();
        console.log(`Type seeded: ${existingType.name}`);
      } else {
        console.log(`Type already exists: ${typeData.name}`);
      }
      return existingType;
    }));

    // Seed Tags
    const tags = await Promise.all(seedData.tags.map(async (tagData) => {
      let existingTag = await Tag.findOne({ name: tagData.name });
      if (!existingTag) {
        existingTag = new Tag(tagData);
        await existingTag.save();
        console.log(`Tag seeded: ${existingTag.name}`);
      } else {
        console.log(`Tag already exists: ${tagData.name}`);
      }
      return existingTag;
    }));

    // Seed Entries
    const entries = await Promise.all(seedData.entries.map(async (entryData) => {
      const existingEntry = await Entry.findOne({ title: entryData.title });
      if (!existingEntry) {
        const entryType = types.find((t) => t.name === entryData.type);
        if (!entryType) {
          throw new Error(`Type not found for entry: ${entryData.title}`);
        }

        const entryTags = entryData.tags.map((tagName) => {
          const tag = tags.find((t) => t.name === tagName);
          if (!tag) {
            throw new Error(`Tag "${tagName}" not found for entry: ${entryData.title}`);
          }
          return tag._id;
        });

        const newEntry = new Entry({
          type: entryType._id,
          title: entryData.title,
          summary: entryData.summary,
          text: entryData.text, // Make sure this is an object in seed-data.json
          image: entryData.image, // Make sure this is an object in seed-data.json
          video: entryData.video, // Make sure this is an object in seed-data.json
          tags: entryTags,
        });
        await newEntry.save();
        console.log(`Entry seeded: ${newEntry.title}`);
        return newEntry;
      }
      console.log(`Entry already exists: ${entryData.title}`);
      return existingEntry;
    }));

    // Add related entries
    await Promise.all(entries.map(async (entry) => {
      const relatedEntries = [];
      const numberOfRelatedEntries = Math.floor(Math.random() * 5); // Random number between 0 and 4
      while (relatedEntries.length < numberOfRelatedEntries) {
        const randomEntry = entries[Math.floor(Math.random() * entries.length)];
        if (randomEntry._id.toString() !== entry._id.toString() && !relatedEntries.includes(randomEntry._id)) {
          relatedEntries.push(randomEntry._id);
        }
      }

      // Update the entry with the related entries
      entry.related = relatedEntries;
      await entry.save();
      console.log(`Related entries added to: ${entry.title}`);
    }));

    console.log('Database seeding completed without duplicating or deleting existing data');
    mongoose.connection.close();
  } catch (err) {
    console.error('Database seeding failed:', err.message);
    process.exit(1);
  }
};

seedDatabase();
