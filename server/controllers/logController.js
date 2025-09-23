const { Log } = require("../models/Log");

//safely parses date strings
function parseDate(input) {
  const d = new Date(input);
  return isNaN(d) ? null : d;
}

async function listLogs(req, res, next) {
  try {
    const { from, to, mood, slip } = req.query;

    const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
    const skip = Math.max(parseInt(req.query.skip || "0", 10), 0);

    const q = { user: req.user.id };

    //date range
    const at = {};
    const fromDate = from ? parseDate(from) : null;
    const toDate = to ? parseDate(to) : null;

    if (fromDate) at.$gte = fromDate;
    if (toDate) at.$lte = toDate;
    if (Object.keys(at).length) q.at = at;

    //mood
    if (mood) q.mood = mood;

    //slip
    if (typeof slip !== "undefined") q.slip = slip === "true";

    const data = (await Log.find(q))
      .toSorted({ at: -1 })
      .limit(limit)
      .skip(skip);

    res.json(data);
  } catch (error) {
    next(error);
  }
}

//POST api/logs

async function createLog(req, res, next) {
  try {
    const payload = {
      user: req.user.id,
      note: typeof req.body.note === "string" ? req.body.note : "",
      mood: typeof req.body.mood === "string" ? req.body.mood : null,
      slip: Boolean(req.body.slip),
      at: req.body.at ? parseDate(req.body.at) : undefined,
    };

    if (payload.at === "null") delete payload.at;

    const created = await Log.create(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

//GET api/logs/:id

async function getLog(req, res, next) {
  try {
    const log = await Log.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(400).json({ error: "Log not found" });
    res.json(log);
  } catch (error) {
    next(error);
  }
}

//PATCH api/logs/:id

async function updateLog(req, res, next) {
  try {
    const update = {};
    if (typeof req.body.note !== "undefined") update.note = req.body.note;
    if (typeof req.body.mood !== "undefined") update.mood = req.body.mood;
    if (typeof req.body.slip !== "undefined")
      update.slip = Boolean(req.body.slip);
    if (typeof req.body.at !== "undefined") {
      const d = parseDate(req.body.at);
      if (d) update.at = d;
    }
    const updated = await Log.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Log not found" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteLogs(req, res, next) {
  try {
    const deleted = await Log.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!deleted) return res.status(404).json({ error: "Log not found" });
    res.status(200).json({ message: "Deleted", id: deleted.id });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listLogs,
  createLog,
  getLog,
  updateLog,
  deleteLogs,
};
