require(['libs/text!header.html', 'libs/text!home.html', 'libs/text!footer.html', 'examples'], function (headerTpl, homeTpl, footerTpl, examples) {

    var ApplicationRouter = Backbone.Router.extend({
        routes: {
            "": "home",
            "example/:name": "loadExample"
        },
        initialize: function() {
            this.headerView = new HeaderView();
            this.headerView.render();
            this.footerView = new FooterView();
            this.footerView.render();
        },
        home: function() {
            this.homeView = new HomeView();
            this.homeView.render();
        },
        loadExample : function(name) {
            if(!this.homeView) { this.home(); }
            this.homeView.loadExample(examples[name]);
        }
    });

    HeaderView = Backbone.View.extend({
        el: "#header",
        templateFileName: "header.html",
        template: headerTpl,

        initialize: function() {
        },

        render: function() {
            $(this.el).html(_.template(this.template));
        }
    });

    FooterView = Backbone.View.extend({
        el: "#footer",
        template: footerTpl,
        render: function() {
            this.$el.html(_.template(this.template));
        }
    });


    HomeView = Backbone.View.extend({
        el: "#content",
        template: homeTpl,
        events : {
            'click .send' : 'sendRequest'
        },

        initialize: function() {

        },
        render: function() {
            $(this.el).html(_.template(this.template));
        },

        sendRequest: function(e) {
            var self = this;

            self.$('.result').html("");

            var service = this.$('.service_select').val();
            var command = this.$('.command_input').val();
            var request = window.jsoneditor.get();

            $.ajax({
                type: 'POST',
                url: '/command/'+service+'/'+command,
                data: request,
                dataType: 'json',
                success: function(data, textStatus, jqXHR) {
                    self.$('.result').html(JSON.stringify(data, undefined, 2));
                },
                error : function(data) {
                    self.$('.result').html("!!!ERROR!!!\n\n"+data.responseText);
                }
            });
        },

        loadExample: function(example) {
            this.$('.service_select').val(example.service);
            this.$('.command_input').val(example.command);
            window.jsoneditor.set(example.request);

            var self = this;
            //Load Example Text
            if(example.example) {
                self.$('.code_example pre').html('');
                self.$('.code_example').show();
                $.ajax({
                    url : "/example_calls/"+example.example,
                    dataType : 'text',
                    cache : false,

                    success: function(data) {
                        //Fix for <>
                        data = data.replace(/\</g, '&lt;');
                        data = data.replace(/\</g, '&gt;');
                        // console.log(data);

                        self.$('.code_example pre').html('<code data-language="javascript">'+data+'</code>');
                        Rainbow.color();
                    }
                });
            } else {
                self.$('.code_example pre').html('');
                self.$('.code_example').hide();
            }
        }
    });

    app = new ApplicationRouter();
    Backbone.history.start();
});


