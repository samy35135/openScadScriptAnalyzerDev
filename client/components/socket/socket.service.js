/* global io */
'use strict';

angular.module('openScadAnalyzerApp')
  .factory('socket', function(socketFactory) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      socket: socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      // syncUpdates: function (modelName, array, cb) {
      //   cb = cb || angular.noop;

      //   /**
      //    * Syncs item creation/updates on 'model:save'
      //    */
      //   socket.on(modelName + ':save', function (item) {
      //     var oldItem = _.find(array, {_id: item._id});
      //     var index = array.indexOf(oldItem);
      //     var event = 'created';

      //     // replace oldItem if it exists
      //     // otherwise just add item to the collection
      //     if (oldItem) {
      //       array.splice(index, 1, item);
      //       event = 'updated';
      //     } else {
      //       array.push(item);
      //     }

      //     cb(event, item, array);
      //   });

      //   /**
      //    * Syncs removed items on 'model:remove'
      //    */
      //   socket.on(modelName + ':remove', function (item) {
      //     var event = 'deleted';
      //     _.remove(array, {_id: item._id});
      //     cb(event, item, array);
      //   });
      // },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncProgressBar: function (modelName) {
        socket.removeAllListeners(modelName + ':progress');
        socket.removeAllListeners(modelName + ':parsing');
        socket.removeAllListeners(modelName + ':downloadScad');
      },

     ////////////////////////////////////////// BATCH //////////////////////////////////////////////////
      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} initStatus
       * @param {Array} batchStatus
       * @param {Array} awesomeThings
       * @param {Function} cb
       */
      syncUpdatesProgressBar : function(modelName, initStatus, batchStatus, awesomeThings, cb){
        cb = cb || angular.noop;
        /**
         * Syncs progress bar'
         */
        socket.on('batchStatus:parsing', function(item){
            console.log('parsing item : thing_id - '+ item.thing_id  + ', parsingMsg - ' + item.parsingMsg);

            var oldItem = _.find(awesomeThings, {thing_id: item.thing_id});
            var event = 'created';
            if (oldItem) {

                oldItem.parsingMsg = item.parsingMsg;
                var index = awesomeThings.indexOf(oldItem);

                var newItem = oldItem;
                newItem.parsingMsg = item.parsingMsg;

                awesomeThings.splice(index, 1, newItem);
                event = 'updated';

                // if(item.thing_id != undefined){
                //   batchStatus.value += 1;
                // }

                cb(event, initStatus, batchStatus, awesomeThings);
            }else {
              awesomeThings.push(item);
            }
        });
        
        
        socket.on('batchStatus:downloadScad', function(item){
          console.log('sacd item : thing_id - '+ item.thing_id  + ', msg - ' + item.msg);

          var oldItem = _.find(awesomeThings, {thing_id: item.thing_id});
          var event = 'created';
          if (oldItem) {

              oldItem.msg = item.msg;

              var index = awesomeThings.indexOf(oldItem);

              var newItem = oldItem;
              newItem.msg = item.msg;

              awesomeThings.splice(index, 1, newItem);
              event = 'updated';

              cb(event, initStatus, batchStatus, awesomeThings);
          }else {
            awesomeThings.push(item);
          }
        });

        socket.on('batchStatus:progress', function (item) {

          console.log('[progress item] : thing_id - '+ item.thing_id 
              + ', max - ' + item.max 
              + ', value - ' + item.value 
              + ', tagCnt - ' + item.tagCnt 
              + ', categoryCnt - ' + item.categoryCnt 
              + ', commentCnt - ' + item.commentCnt 
              + ', fileCnt - ' + item.fileCnt);

          var oldItem = _.find(awesomeThings, {thing_id: item.thing_id});
          var event = 'created';
          if (oldItem) {
              var index = awesomeThings.indexOf(oldItem);

              var newItem = oldItem;
              newItem.thing_id = item.thing_id;
              newItem.tagCnt = item.tagCnt;
              newItem.categoryCnt = item.categoryCnt;
              newItem.commentCnt = item.commentCnt;
              newItem.fileCnt = item.fileCnt;

              awesomeThings.splice(index, 1, newItem);
              event = 'updated';

              cb(event, initStatus, batchStatus, awesomeThings);
          }else {
              awesomeThings.push(item);
          }

          batchStatus.max = item.max;
          batchStatus.value = item.value;



          if(item.value != undefined){
            initStatus.value += 1;
          }
          
          cb(event, initStatus, batchStatus, awesomeThings);

        });




      },// batch

      /////////////////////////////////////////////////////////////////

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, batchStatus, awesomeThings, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on('forceParsing:parse', function(item){

        console.log('received item : thing_id - '+ item.thing_id  + ', file_id - ' + item.file_id + ', parsingMsg - ' + item.parsingMsg);

            var oldItem = _.find(awesomeThings, {file_id: item.file_id});
            var event = 'created';
            if (oldItem) {

                oldItem.parsingMsg = item.parsingMsg;
                var index = awesomeThings.indexOf(oldItem);

                var newItem = oldItem;
                newItem.parsingMsg = item.parsingMsg;
                newItem.errMsg = item.errMsg;
                awesomeThings.splice(index, 1, newItem);
                event = 'updated';

                if(item.thing_id != undefined){
                  batchStatus.value += 1;
                }

                cb(event, batchStatus, awesomeThings);
            }else {
              awesomeThings.push(item);
            }
        });


      },

            /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':progress');
        socket.removeAllListeners(modelName + ':parsing');
        socket.removeAllListeners(modelName + ':downloadScad');
      },
      
    };
  });
