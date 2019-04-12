var stationSection_section = $file.read('assets/station_name_section.json')
var stationSectionObject_anti = JSON.parse(stationSection_section.string)
var stationSection_section_quanpin = $file.read('assets/station_name_section_quanpin.json')
var stationSectionObject_anti_quanpin = JSON.parse(stationSection_section_quanpin.string)
var tool = require('scripts/tool')
var idString = ""

module.exports = {
    showStationList: showStationList,
    // giveData: giveData
}

function showStationList(id) {
    idString = id
    $ui.push({
        events: {
            appeared: function() {
                $("station_list").focus()
            }
          },
        props: {
            id: "superView_Custom",
            title: "车站列表"
        },
        views: [{
            type: "input",
            props: {
                placeholder: "请输入车站",
                id: "station_list",
                align: $align.center
            },
            layout: function (make) {
                make.top.equalTo(10)
                make.left.right.inset(10)
                make.height.equalTo(40)
            },
            events: {
                changed: function (sender) {
                    screeningContent(sender.text)
                },
                returned: function (sender) {
                    $("station_list").blur()
                }
            }
        }, 
        // {
        //     type: "button",
        //     props: {
        //         title: "确定",
        //         id: "button_list",
        //         align: $align.center,
        //     },
        //     layout: function (make) {
        //         make.top.equalTo(10)
        //         make.right.inset(10)
        //         make.height.equalTo(32)
        //         make.left.equalTo($("station_list").right).offset(5)
        //         make.width.equalTo(80)
        //     },
        //     events: {
        //         tapped: function (sender) {
        //             $(idString).text = $("station_list").text
        //             $ui.pop()
        //         }
        //     }
        // }, 
        {
            type: "list",
            props: {
                data: stationSectionObject_anti.data,
                stickyHeader: true
            },
            layout: function (make, view) {
                make.top.equalTo($("station_list").bottom).offset(10)
                make.left.right.bottom.equalTo(view.super)
            },
            events: {
                didSelect: function (sender, indexPath, data) {
                    $(idString).text = data
                    $ui.pop()
                },
                didScroll: function (sender) {
                    $("station_list").blur()
                }
            }
        }, {
            type: "view",
            props: {
                id: "search_view"
            },
            layout: function (make, view) {
                make.right.bottom.equalTo(view.super)
                make.top.equalTo($("list"))
                make.right.equalTo(0)
                make.width.equalTo(50)
            }
        }]
    })
    var lastViewBottom = 50
    for (var value of stationSectionObject_anti.index) {
        var searchButton =
        {
            type: "button",
            props: {
                title: value,
                bgcolor: $color("#FF0000"),
                font: $font(12)
            },
            layout: function (make, view) {
                make.top.equalTo(lastViewBottom)
                make.right.equalTo(-15)
                make.size.equalTo($size(15, 15))
            },
            events: {
                tapped: function (sender) {
                    let section = contains(stationSectionObject_anti.index, sender.title)
                    var indexPath = $objc("NSIndexPath").invoke("indexPathForRow:inSection:", 0, section)
                    $("list").runtimeValue().invoke("scrollToRowAtIndexPath:atScrollPosition:animated:", indexPath, 1, 0)
                    $device.taptic(2)
                }
            }
        }
        $("search_view").add(searchButton)
        lastViewBottom = lastViewBottom + 20
    }
}


function contains(arrays, obj) {
    var i = arrays.length;
    while (i--) {
        if (arrays[i] === obj) {
            return i;
        }
    }
    return false;
}

function screeningContent(text) {
    // $console.info($text.convertToPinYin(text));

    var textString = $text.convertToPinYin(text).replace(/\s+/g,"").toLowerCase()

    $("search_view").hidden = (text != "")

    var newData = []
    for (var i = 0, len = stationSectionObject_anti_quanpin.data.length; i < len; i++) {
        var title = stationSectionObject_anti_quanpin.data[i].title
        var rows = stationSectionObject_anti_quanpin.data[i].rows
        var newTuple = {}
        var newRows = []
        for (var ii = 0, lenlen = rows.length; ii < lenlen; ii++) {
            // 车站名
            var titleString = rows[ii][0]
            // 车站名拼音
            var titleStringNoSpace = rows[ii][1]
            // 车站名拼音缩写
            var titleStringAbbreviation = rows[ii][2]
            // console.info(titleStringNoSpace)
            // 车站名是否和输入内容匹配
            var chineseBool = new RegExp(text).test(titleString)
            // 车站名拼音是否和输入内容匹配
            var topIndex = titleStringNoSpace.search(textString)
            var topIndexAbbreviation = titleStringAbbreviation.search(textString)
            if (chineseBool || topIndex == 0 || topIndexAbbreviation == 0) {
                newRows.push(titleString)
            }
        }
        if (newRows.length > 0) {
            newTuple["title"] = title
            newTuple["rows"] = newRows
            newData.push(newTuple)
        }
    }
    $("list").data = newData
}