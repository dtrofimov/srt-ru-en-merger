#!/usr/bin/env node
const _ = require('underscore');
const fs = require('fs');
const parser = require('subtitles-parser');

const enStr = fs.readFileSync('en.srt', 'utf8');
const enRecords = parser.fromSrt(enStr);

const ruStr = fs.readFileSync('ru.srt', 'utf8');
const ruRecords = parser.fromSrt(ruStr);

_.each([
	{records: ruRecords, prefix: "{\\an8}"},
	{records: enRecords, prefix: "{\\an2}"},
	], function(args) {
		const records = args.records;
		const prefix = args.prefix;
		_.each(records, function(record) {
			record.text = prefix + record.text;
		});
});

const resRecordsUnsorted = ruRecords.concat(enRecords)
const resRecords = _.sortBy(resRecordsUnsorted, function(record) {
	return record.startTime;
});
_.each(resRecords, function(record, i) {
	record.id = i.toString();
});

const resStr = parser.toSrt(resRecords);
fs.writeFileSync('ru-en.srt', resStr);

// console.log(_.range(5));
// console.log(enStr);
