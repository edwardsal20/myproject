Vue.directive('focus',{
    inserted:function(el){
        el.focus()
    }
})
var app = new Vue({
    el: "#wrapper",
    data: {
        query: "",
        debounce: 0,
        hlight:'',
        musicList: [],
        likeList: [],
        playList: [],
        searchList: [],
        show: {
            songs: "",
            likes: "",
            plays: ""
        },
        musicUrl: ""
    },
    methods: {
        searchMusic: function () {
            let q = this.query
            if (!this.searchList[q]) {
                axios.get("https://autumnfish.cn/search?keywords=" + q).then(
                (response) => {
                    this.musicList = response.data.result.songs
                    this.searchList[q] = response.data.result.songs
                },err => {}
                )
            }
            else {
                this.musicList = this.searchList[q]
            }
        },
        playMusic: function (item,event) {
            axios.get("https://autumnfish.cn/song/url?id=" + item.id).then(response =>{
                if (response.data.data[0].url == null) {
                    item.ftype = "x"
                    var tip = document.getElementById("tipNoShow")
                    if (tip !== null) {
                        tip.id = "tipShow"
                        this.debounce = setTimeout(() => {
                            tip.id = "tipNoShow"
                        }, 700)
                    }else{
                        let sTip = document.getElementById("tipShow")
                        clearTimeout(this.debounce)
                        this.debounce = setTimeout(() => {
                            sTip.id = "tipNoShow"
                        }, 1500)
                    }
                }
                else{
                    this.musicUrl = response.data.data[0].url
                    let target = event.target
                    if(target.tagName != 'LI') return
                    this.highlight(target)
                }
            }, err => {})
        },
        changeShow: function (showThing) {
            this.show.songs = ""
            this.show.likes = ""
            this.show.plays = ""
            this.show[showThing] = showThing
        },
        clone: function (item, list) {
            function deepClone(obj) {
                (function () {
                    for (let key in arguments) {
                        if (obj instanceof window[arguments[key]])
                            return new window[arguments[key]](obj)
                    }
                })('Date', 'RegExp', 'Error')
                if (typeof obj === 'function')
                    return eval('(' + obj.toString() + ')')
                if (obj === null) return null
                if (typeof obj !== "object") return obj
                let newObj = new obj.constructor
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        newObj[key] = deepClone(obj[key])
                    }
                }
                return newObj
            }
            switch (list) {
                case 'likeList':
                    item.status = "x"
                    this.likeList.push(deepClone(item))
                    break
                case 'playList':
                    item.rtype = "x"
                    this.playList.push(deepClone(item))
                    break
            }
        },
        highlight:function(tag){
            if(this.hlight){
                this.hlight.classList.remove('highlight') 
            }
                this.hlight = tag
                this.hlight.classList.add('highlight')
        }
    }
})


