define(function(require, exports, module) {
  /**
   * 列表基类
   *
   * @module Listview
   */
  'use strict';

  var $ = require('$'),
    Spinner = require('spin'),
    Widget = require('widget'),
    Handlebars = require('handlebars');

    var Core = Widget.extend({
    	defaults: {
        element: '',
        url: 'http://compass.17173.com/2014/11/news1114/index.php?do=NewsList',
        pageSize: 10,
        kind: [],
        page: 1,
        threshold: 20,
        autoload: false, //加载更多的方式
        button: '',
        callback: function(){

        }
      }, 
      setup: function(){
        var self = this;
        self.page = self.option('page');
        this.getData();
      },

      getData: function(){
        var self = this;
        $.ajax({
          url: self.option('url'),
          dataType: 'JSON',
          beforeSend: function(){
            self.state = 'INAJAX';
            self.beforeSend();
          },
          data: {
            page: self.page,
            pageSize: self.option('pageSize'),
            newsKind: JSON.stringify(self.option('kind')) 
          }
        }).done(function(data){
          self.state = 'NORMAL';
          self.done(data);
        }).fail(function() {
          console.log("error");
        })
      },

      done: function(data){

        var self = this;
        self.total = data.total;

        // 发生错误
        if(data.msg){
          alert(data.msg);
          return;
        }

        // 无数据 
        if(self.total == 0){
          $(self.element).html('<div class="no-data">暂无数据。</div>')
          return;
        }

        self.parseData(data);

      },

      refresh: function(){
        self.page = 1;
        self.element.html('');
        self.getData();
      }

	});


	module.exports = Core;
});
