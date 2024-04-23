const web = require('./web/index-web.js');
const mobile = require('./mobile/index-mobile.js')

web.listen(3001, (error) => {
    if(error)
    {
        console.error('Unable to start the web server -> ', error);
    }
    else
    {
        console.log('\x1b[32m%s\x1b[0m', 'Web server running...');
    }
});

mobile.listen(8082, (error) => {
    if(error)
    {
        console.error('Unable to start the mobile server -> ', error);
    }
    else
    {
        console.log('\x1b[32m%s\x1b[0m', 'Mobile server running...');
    }
});