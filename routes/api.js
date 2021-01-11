'use strict';
const mongoose = require('mongoose');
let db = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);


module.exports = function (app) {
  const issueSchema = new mongoose.Schema({
    assigned_to: String,
    status_text: String,
    open: Boolean,
    issue_title: String,
    issue_text: String,
    created_by: String,
    created_on: Date,
    updated_on: Date,
    project: String,
    __v: false
});

  const Issue = mongoose.model('Issue', issueSchema);
  
  app.route('/api/issues/:project')
    
    .get(function (req, res){
      let project = req.params.project;
      let filterObj = Object.assign({}, req.query, {project: project})
      Issue.find(
        filterObj, (error, data) => {
        if(error) {
            console.log(error)
        } else {
          res.send(data);
        }
      })
    })
    
    .post(function (req, res){
      let project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
          return res.json({error: 'required field(s) missing'})
          }
      var newIssue = new Issue({
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        open: true,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: new Date(),
        updated_on: new Date(),
        project: project
      });

      newIssue.save((err, data) => {
         if(err) {
            return console.error(err);  
          } else {
            return res.json(data);
          }
      })
    })

    .put(function (req, res){
      let project = req.params.project;
      let issueId = req.body._id
      let updateObj = {}
      if(!issueId) {
        return res.json({error: 'missing _id'})
      }
      Object.keys(req.body).forEach((key) => {
        if(req.body[key]){
          updateObj[key] = req.body[key]
        }
      })
      if(Object.keys(updateObj).length < 2){
        return res.json({error: 'no update field(s) sent', '_id': issueId})
      }
      updateObj['updated_on'] = new Date()
      Issue.findByIdAndUpdate(
        issueId,
        updateObj,
        {new: true},
        (error, updatedIssue) => {
          if(!error && updatedIssue){
            return res.json({result: 'successfully updated', '_id': issueId})
          }else if (!updatedIssue){
            return res.json({error: 'could not update', '_id': issueId})
          }
        }
        )
        })
    
    .delete(function (req, res){
      let project = req.params.project;
      let issueId = req.body._id;
      if(!issueId) {return res.json({error: 'missing _id'})}
      Issue.findByIdAndRemove(issueId, function(err, data){
        if(!err && data){
          res.json({result: 'successfully deleted', '_id': issueId});
        } else if(!data){
          res.json({error: 'could not delete', '_id': issueId})
        } 
      })
    });
    
};
