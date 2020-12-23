'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const context = require('./models')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/leagues', function (req, res) {

  if(!req.body.name || !req.body.country){ res.send("parameters are required"); }

  var league = context.league.build({
        name: req.body.name,
        country: req.body.country
    });
    
    league.save().then((rows) => {
        res.send({isSuccess: true}); 
    }).catch(() => {
        res.send({isSuccess: false}); 
    }); 
})

app.get('/leagues', function (req, res) {
  
  context.league.findAll().then((rows) => {
    res.send(rows.map(r => {
      let league = {};
      league.id = r.dataValues.id,
      league.name = r.dataValues.name;
      league.country = r.dataValues.country;

      return league;
    }));
  });
})


app.post('/leagues/:leagueId/teams', function (req, res) {

  if(!req.body.name || !req.body.logo){ res.send("parameters are required"); }
  
   var team = context.team.build({
        name: req.body.name,
        logo: req.body.logo,
        leagueId: req.params.leagueId
    });
    
    team.save().then(() => {
        res.send({isSuccess: true}); 
    }).catch(() => {
        res.send({isSuccess: false}); 
    });
})

app.get('/leagues/:leagueId/teams', function (req, res) {
  
  context.team.findAll().then((rows) => {
    res.send(rows.map(r => {
      let team = {};
      team.id = r.dataValues.id,
      team.name = r.dataValues.name;
      team.logo =  r.dataValues.logo;

      return team;
  }));
  }).catch(()=>{
    res.send("error");
  });
})

app.get('/leagues/:leagueId/teams/:teamId', function (req, res) {
  
  context.team.findAll({
      include:[{
        model: context.league,
        where: {
          id: req.params.leagueId
        }
      }],
       where: {
           id: req.params.teamId
       }
     }).then((rows) => {
       res.send(rows.length == 0 ? [] : {
         id: rows[0].dataValues.id,
         name: rows[0].dataValues.name,
         logo: rows[0].dataValues.logo
       }); 
   }).catch((error) => {
       res.send({isSuccess: false}); 
   });;
})

app.delete('/leagues/:leagueId/teams/:teamId', function (req, res) {
  
   context.team.destroy({
        where: {
            leagueId: req.params.leagueId,
            id: req.params.teamId
        }
      }).then(() => {
        res.send({isSuccess: true}); 
    }).catch(() => {
        res.send({isSuccess: false}); 
    });;
})

app.put('/leagues/:leagueId/teams/:teamId', function (req, res) {
  
  context.team.update({
    name: req.body.name
    }, {
       where: {
           leagueId: req.params.leagueId,
           id: req.params.teamId
       }
     }).then(() => {
       res.send({isSuccess: true}); 
   }).catch(() => {
       res.send({isSuccess: false}); 
   });;
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});