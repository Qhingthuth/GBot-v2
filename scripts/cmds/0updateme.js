const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

module.exports = {
 config: {
 name: "updateme",
 version: "1.0",
 author: "JV Barcenas",
 countDown: 5,
 role: 0,
 shortDescription: "sarcasm",
 longDescription: "Utility",
 category: "FUN",
 },
 lastSentMinute: null,
 messageSent: true, // Flag to track if a message has already been sent
 onStart: async function() {},
 onLoad: async function({
 api,
 event,
 message,
 getLang,
 args,
 }) {
 const checkForUpdates = async () => {
 const currentTimePH = moment().tz('Asia/Kathmandu').format('hh:mm A');

 try {
 const filePath = path.join(__dirname, 'schedule.json');
 const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

 const updates = [];
 const currentMinute = moment().tz('Asia/Kathmandu').startOf('minute').format('YYYY-MM-DD HH:mm');

 for (const entry of data) {
 const time = moment(entry.time, 'h:mmA').format('hh:mm A');
 if (time === currentTimePH) {
 const { animeTitle, episode } = entry;
 const update = `✨CURRENT ANIME UPDATE✨: ${animeTitle}\Episode: ${episode}\Time: ${time}`;
 updates.push(update);
 }
 }

 if (updates.length !== 0 && !this.messageSent) {
 const message = updates.join('\\');
 api.sendMessage(message, '6550887804957672', '6323714261026753', '6443270659124163');
 console.log('Anime update message sent successfully!');
 this.messageSent = true;
 }

 if (this.messageSent && updates.length === 0) {
 // Reset the messageSent flag if there are no updates
 this.messageSent = false;
 }

 this.lastSentMinute = currentMinute; // Update the last sent minute
 } catch (error) {
 console.error('Error reading schedule data:', error);
 }
 };

 // Run the update check every minute
 const interval = setInterval(checkForUpdates, 6000);

 // Perform an initial update check immediately
 await checkForUpdates();
 }
};