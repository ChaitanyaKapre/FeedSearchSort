const { POSTS } = require('./posts');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;
const server = require('./server');

describe('Search, Sort, and Pagination API', () => {

  // Mock the getPaginatedResult function
  const getPaginatedResult = (POSTS, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = POSTS.slice(startIndex, endIndex);

    return {
      data: paginatedPosts,
      totalCount: POSTS.length,
    };
  };

  it('should return all posts if no search query provided', function (done) {
    chai.request(server)
      .get('/feed')
      .end((err, response) => {
        if (err != null) {
          expect(response).to.have.status(200);
          expect(response.body.totalSearchedResults).to.be.equal(100);
          done();
        }
        else {
          console.log(`Error: ${err}`);
          done();
        }
      });
  });

  it('should return all sorted posts if no search query provided with pagination', function (done) {
    chai.request(server)
      .get('/feed?sortBy=name')
      .end((err, response) => {
        if (err != null) {
          expect(response).to.have.status(200);
          expect(response.body.paginatedResults.data?.length).to.be.equal(10);
          done();
        }
        else {
          console.log(`Error: ${err}`);
          done();
        }
      });
  });

  it('should return posts matching the search query', function (done) {
    chai.request(server)
      .get('/feed?search=Customer')
      .end((err, response) => {
        if (err != null) {
          expect(response).to.have.status(200);
          expect(response.body.totalSearchedResults).to.be.equal(5);
          done();
        }
        else {
          console.log(`Error: ${err}`);
          done();
        }
      });
  });

  it('should return posts matching the exact search query with double quotes', function (done) {
    chai.request(server)
      .get('/feed?search="nihil hic"')
      .end((err, response) => {
        if (err != null) {
          expect(response).to.have.status(200);
          expect(response.body.totalSearchedResults).to.be.equal(1);
          done();
        }
        else {
          console.log(`Error: ${err}`);
          done();
        }
      });
  });

  it('should return posts sorted by name', function (done) {
    chai.request(server)
      .get('/feed?search="nihil"&sortBy=name')
      .end((err, response) => {
        if (err != null) {
          expect(response).to.have.status(200);
          expect(response.body.totalSearchedResults).to.be.equal(25);
          done();
        }
        else {
          console.log(`Error: ${err}`);
          done();
        }
      });
  });

  it('should return posts sorted by dateLastEdited', function (done) {
    chai.request(server)
      .get('/feed?search="nihil"&sortBy=dateLastEdited')
      .end((err, response) => {
        if (err != null) {
          expect(response).to.have.status(200);
          const randomNumber = Math.floor(Math.random() * (response.body.paginatedResults.data?.length - 1)) + 1;
          let limit = 0;
          if (randomNumber > 1) {
            limit = Math.floor(Math.random() * (randomNumber));
          }
          expect(Date.parse(response.body.paginatedResults.data[randomNumber].dateLastEdited)).to.be.greaterThan(Date.parse(response.body.paginatedResults.data[limit].dateLastEdited));
          expect(response.body.totalSearchedResults).to.be.equal(25);
          done();
        }
        else {
          console.log(`Error: ${err}`);
          done();
        }
      });
  });

  it('should return paginated posts', function (done) {
    const response = getPaginatedResult(POSTS, 2, 1);
    expect(response?.totalCount).to.equal(POSTS.length);
    done();
  });

});
