import db from "../db/conn.mjs";
import { ObjectId } from 'mongodb';

// Get single grade entry by id
async function getSingleGrade(req, res){
    try {

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({msg: "Invalid ID format"})
        }
        let query = {_id: new ObjectId(req.params.id)}

        let collection = await db.collection('grades');

        let result = await collection.findOne(query);

        res.json(result);
    } catch (err) {
        console.error(err)
        res.status(500).json({msg: 'Server Error'});
    }
}

// Get grades by student id
async function getStudentGrades(req, res){
    try {
        let query = {learner_id: Number(req.params.id)}

    let collection = await db.collection('grades')

    let results = await collection.find(query).toArray();

    res.json(results)
    } catch (err) {
        console.error(err)
        res.status(500).json({msg: 'Server Error'})
    }
    
}

// Get grades by class id
async function getClassGrades(req, res){
    try {
        let query = {class_id: Number(req.params.id)}

    let collection = await db.collection('grades')

    let results = await collection.find(query).toArray();

    res.json(results)
    } catch (err) {
        console.error(err)
        res.status(500).json({msg: 'Server Error'})
    }
    
}

// Create new grades in DB
async function createGrade(req, res) {
    try {

        let collection = await db.collection('grades')

        let results = await collection.insertOne(req.body);

        res.json(results);

    } catch (err) {
        console.error(err)
        res.status(500).json({msg: 'Server error'});
    }
}




// Aggregation pipeline that gets number of students with an average higher than 70%, total number of learners
// and the percentage of learner with an average higher than 70%
async function getClassStatus(req, res) {
    try {

        console.log('GET /grades/states endpoint hit');
        
        let collection = await db.collection('grades');

        let result = await collection.aggregate([
          {
            '$project': {
              '_id': 0, 
              'learner_id': 1, 
              'class_id': 1, 
              'weightedAverage': {
                '$sum': [
                  { '$multiply': [ {  '$avg': '$exam' }, 0.5 ] }, 
                  { '$multiply': [ {  '$avg': '$quiz' }, 0.3  ] }, 
                  { '$multiply': [ {  '$avg': '$homework' }, 0.2 ] }
                ]
              }
            }
          }, {
            '$match': {
              'weightedAverage': { '$gt': 0.7
              }
            }
          }, {
            '$count': 'learners'
          }
        ]).toArray();

        let count = 0;
        if (result.length > 0) {
          count = result[0].learners;
        }
        res.json({learners: count});
    } catch (err) {
        console.error("Error in getClassStatus:", err)
        res.status(500).json({msg: 'Server Error'})
    }
}

// All class averages for one learner
async function studentClassesAverage(req, res){
  let collection = await db.collection('grades');

  let results = await collection.aggregate([
      {
        $match: { student_id: Number(req.params.id) },
      },
      {
        $unwind: { path: "$scores" },
      },
      {
        $group: {
          _id: "$class_id",
          quiz: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "quiz"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          exam: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "exam"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          homework: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "homework"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          class_id: "$_id",
          avg: {
            $sum: [
              { $multiply: [{ $avg: "$exam" }, 0.5] },
              { $multiply: [{ $avg: "$quiz" }, 0.3] },
              { $multiply: [{ $avg: "$homework" }, 0.2] },
            ],
          },
        },
      },
    ]).toArray()

    res.json(results)
}

export default { getSingleGrade, getClassGrades, getStudentGrades, createGrade, getClassStatus, studentClassesAverage };