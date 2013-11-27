Stalls = new Meteor.Collection('stalls');

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

if (Meteor.isClient) {
    Template.pollform.stalls = function () {
        return Stalls.find({}, {sort: {name: 1}});
    }

    validate = function(){
        if(!$("#name").val()) { $("#entername").removeClass('hidden'); } else { $("#entername").addClass('hidden'); }
        if($(".item .image .like .icon").hasClass('like')) { $("#enterstall").addClass('hidden'); } else { $("#enterstall").removeClass('hidden'); }
        if(!$("#comment").val()) { $("#entercomment").removeClass('hidden'); } else { $("#entercomment").addClass('hidden'); }
    }

    Template.pollform.events({
        'click #submit' : function() {
            validate();
            Stalls.update(
                {'_id': $('.like .like').attr('id')}, 
                { 
                    $push: { 
                        'votes' : {
                            'user': $("#name").val(), 
                            'comment': $("#comment").val(),
                            'timestamp': new Date().getTime()
                        }
                    }
                }
            );
            $("#success").slideDown().delay(5000).slideUp();
            $("#theForm").slideUp().delay(5000).slideDown();
            $("#name").val(''), $("#comment").val(''), $('.icon').removeClass('like');
        },

        /*
        'click .item' : function() {
            validate();
        },
        'change input' : function(){
            validate();
        }
        */
    });

    Template.voteitem.events({
        'click .item' : function() {
            $('.item .like .like').removeClass('like');
            $('.standOut').removeClass('standOut');
            $( "#" + this._id ).addClass('like').parent().parent().parent().addClass('standOut');
        }
    });

    Template.results.stalls = function() {
        return Stalls.find({}, {sort: {name: 1}} );
    }

}

if (Meteor.isServer) {
    Meteor.startup(function () {
    });
}
