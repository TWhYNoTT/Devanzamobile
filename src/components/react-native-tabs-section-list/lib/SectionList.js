"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_native_1 = require("react-native");
var TabBar_1 = require("./TabBar");
var SectionList = /** @class */ (function (_super) {
    __extends(SectionList, _super);
    function SectionList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            currentIndex: 0
        };
        _this.blockUpdateIndex = false;
        _this.sectionList = React.createRef();
        return _this;
    }



    SectionList.prototype.onPress = function (index) {
        var _this = this;
        _this.setState({ currentIndex: index });
        _this.blockUpdateIndex = true;
        var sectionList = _this.sectionList.current;
        if (sectionList && sectionList.scrollToLocation) {
            sectionList.scrollToLocation({
                animated: true,
                itemIndex: 0,
                viewOffset: 0,
                sectionIndex: index
            });
        }
    };
    SectionList.prototype.render = function () {
        var _this = this;
        var _a = this.props, sections = _a.sections, renderTab = _a.renderTab, tabBarStyle = _a.tabBarStyle, scrollToLocationOffset = _a.scrollToLocationOffset;
        var prepareSections = sections.map(function (item, index) { return (__assign({}, item, { index: index })); });
        return (<react_native_1.View style={{ flex: 1 }}>
            <TabBar_1.default sections={prepareSections} renderTab={renderTab} tabBarStyle={tabBarStyle} currentIndex={this.state.currentIndex} onPress={function (index) {
                _this.setState({ currentIndex: index });
                _this.blockUpdateIndex = true;
                var sectionList = _this.sectionList.current;
                if (sectionList && sectionList.scrollToLocation) {
                    sectionList.scrollToLocation({
                        animated: true,
                        itemIndex: 0,
                        viewOffset: scrollToLocationOffset || 0,
                        sectionIndex: index
                    });
                }
            }} />

            <react_native_1.SectionList {...this.props} sections={prepareSections} onViewableItemsChanged={function (_a) {
                var viewableItems = _a.viewableItems;
                if (!_this.blockUpdateIndex && viewableItems[0]) {
                    var currentIndex = viewableItems[0].section.index;
                    if (_this.state.currentIndex !== currentIndex) {
                        _this.setState({ currentIndex: currentIndex });
                    }
                }
            }} viewabilityConfig={{
                minimumViewTime: 10,
                itemVisiblePercentThreshold: 10
            }} ref={this.sectionList} onMomentumScrollEnd={function () { return (_this.blockUpdateIndex = false); }} />
        </react_native_1.View>);
    };
    return SectionList;
}(React.PureComponent));
exports.default = SectionList;
//# sourceMappingURL=SectionList.js.map