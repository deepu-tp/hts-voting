Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function () {
    this.route('pollform', {
        path: '/'
    });
    this.route('results', {
        path: '/results'
    });
});