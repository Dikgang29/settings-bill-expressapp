const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const moment = require('moment');
const SettingsBill = require('./settings-bill');
const app = express();
const settingsBill = SettingsBill();



app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));
    
app.get('/',(req,res)=>{
 
    res.render('index', {
         totals : settingsBill.totals(),
         setting : settingsBill.getSettings(),
         classAdd : settingsBill.addClass()
        });
});
app.post('/settings', (req,res)=>{

    settingsBill.setSettings({
        callCost : req.body.callCost,
        smsCost : req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });
    ;
    
    
   
    res.redirect('/');
    
}); 

app.post('/action', (req,res)=>{
 
settingsBill.recordAction(req.body.actionType)
res.redirect('/')
});
app.get('/actions', (req,res)=>{
    //loop through the actionList object array

    
    for (const actionListObj of settingsBill.actions()){

        actionListObj.timestamp = moment().fromNow();
    }
    

    res.render('actions', {actions: settingsBill.actions() });

});  

app.get('/actions/:actionType', (req,res)=>{

    for (const actionListObj of settingsBill.actions()){

        actionListObj.timestamp = moment().fromNow();
    }
    const actionType = req.params.actionType;


    res.render('actions', {actions: settingsBill.actionsFor(actionType) });

});

const PORT = process.env.PORT || 3012
app.listen(PORT, ()=>{
    console.log('the server started at port:', PORT)
})