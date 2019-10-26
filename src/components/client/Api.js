

export const getQuestBody = ({ key }) => {
  return new Promise ( async resolve => {

    setTimeout(() => {
      // resolve(`{hell:'yeah'}`)

      if(key === 'ok') {

        resolve({result:{

          id:14, // not sure
          name:`First quest`,
          gift_photo:`https://i.ebayimg.com/00/s/MTI1NlgxNDU3/z/oQ4AAOSwX6NdVJlO/$_57.JPG`,
          gift_description:`You will get a lego`,
          tasks:[

            {
              id:101,
              index:1,
              question:`Putin's name`,
              description:`He is the russian president`,
              type:1,
              unlocked:true,
              done:true
            },
            {
              id:102,
              index:2,
              question:`Pick giraffe`,
              description:`He has a long neck`,
              type:2,
              options:[
                {text:'opt 1',url:'https://avatars.mds.yandex.net/get-pdb/216365/eb43844b-51d6-41a0-86c0-0f3c47da5b48/s1200'},
                {text:'opt 2',url:'https://4shvostikom.ru/img/derevyannyj-pestryj-bolshoj-zhiraf_0.jpg'},
                {text:'opt 3',url:'https://img.youtube.com/vi/xs2Us3L_s-k/0.jpg'},
                {text:'opt 4',url:'https://img3.goodfon.ru/original/320x240/a/9b/glaza-zhivotnye-zelenyy-lyagushka.jpg'},
              ],
              unlocked:true,
              done:false
            },
            {
              id:103,
              index:3,
              question:`Number of the current hackathon`,
              description:`2nd one wes a year ago`,
              type:1,
              unlocked:false,
              done:false
            },
          ]

        }})

      } else {
        resolve({error:{message:`Wrong key`, code:`WRONG_KEY`}})
      }








    }, 300);

  })
}




// /getQuestBody - (key) --> null or an object of the quest  ( INSTEAD OF LOGIN )
// /checkAnswer (quest_id, task_index (OR JUST TASK_INDEX), answer) --> null or an object of the quest
//

// checkAnswer( task_id, answer )
