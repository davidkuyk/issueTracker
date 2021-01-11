const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
       chai.request(server)
       .post('/api/issues/test')
       .send({
          issue_title: 'Test Title',
          issue_text: 'Test text is here.',
          created_by: 'Mr. Tester',
          assigned_to: 'Mr. Worker',
          status_text: 'testing',
          open: true,
          created_on: new Date(),
          updated_on: new Date(),
          project: 'test'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Test Title');
          assert.equal(res.body.issue_text, 'Test text is here.');
          assert.equal(res.body.created_by, 'Mr. Tester');
          assert.equal(res.body.assigned_to, 'Mr. Worker');
          assert.equal(res.body.status_text, 'testing');
          assert.equal(res.body.open, true);
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.equal(res.body.project, 'test');
          done();
        });
      });

    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
       chai.request(server)
       .post('/api/issues/test')
       .send({
          issue_title: 'Test Title',
          issue_text: 'Test text is here.',
          created_by: 'Mr. Tester',
          project: 'test'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Test Title');
          assert.equal(res.body.issue_text, 'Test text is here.');
          assert.equal(res.body.created_by, 'Mr. Tester');
          assert.equal(res.body.project, 'test');
          done();
        });
      });

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
       chai.request(server)
       .post('/api/issues/test')
       .send({
          issue_title: 'Test Title',
          issue_text: 'Test text is here.',
          project: 'test'
        })
        .end(function(err, res){
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
      });

    test('View issues on a project: GET request to /api/issues/{project}', function(done) {
       chai.request(server)
        .get('/api/issues/test')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          theArray = res.body;
          theArray.forEach((i) => {
            assert.equal(i.project, 'test')
          });
          done();
        });
      });

      test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
       chai.request(server)
        .get('/api/issues/test')
        .query({created_by: 'Mr. Tester'})
        .end(function(err, res, req){
          theArray = res.body;
          theArray.forEach((i) => {
            assert.equal(i.created_by, 'Mr. Tester')
          });
          done();
        });
      });

      test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
       chai.request(server)
        .get('/api/issues/test')
        .query({created_by: 'Mr. Tester', issue_title: 'Test Title'})
        .end(function(err, res, req){
          theArray = res.body;
          theArray.forEach((i) => {
            assert.equal(i.created_by, 'Mr. Tester')
            assert.equal(i.issue_title, 'Test Title')
          });
          done();
        });
      });
    
      test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5feba7ec572d910c167e9eed',
          created_by: 'Mrs. Testi',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated')
        });
        done();
      });

      test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5feba7ec572d910c167e9eed',
          created_by: 'Mrs. Testi',
          issue_title: 'Updated title'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated')
        });
        done();
      });

      test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          created_by: 'Mrs. Testi',
          issue_title: 'Updated title'
        })
        .end(function(err, res){
          assert.equal(res.body.error, 'missing _id')
        });
        done();
      });

      test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5feba7ec572d910c167e9eed'
        })
        .end(function(err, res){
          assert.equal(res.body.error, 'no update field(s) sent')
        });
        done();
      });

      test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'invalidid',
          issue_title: 'Updated title'
        })
        .end(function(err, res){
          assert.equal(res.body.error, 'could not update')
        });
        done();
      });

      test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
       chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: '5febb3c10c25060fa6173cc3'
        })
        .end(function(err, res){
          assert.equal(res.body.result, 'successfully deleted')
        });
        done();
      });

      test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
       chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: 'invalidid'
        })
        .end(function(err, res){
          assert.equal(res.body.error, 'could not delete')
        });
        done();
      });

      test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
       chai.request(server)
        .delete('/api/issues/test')
        .end(function(err, res){
          assert.equal(res.body.error, 'missing _id')
        });
        done();
      });
});
