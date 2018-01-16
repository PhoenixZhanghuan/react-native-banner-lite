import React, {
  Component,
} from 'react';

import {
  PropTypes,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ListView,
} from 'react-native';

import RCC from "../../app/model/RCConst";
import RCImage from  "../../app/component/RCImage"

export default class DiscussBannerScrollView extends Component {

	static propTypes = {
		items: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string,
			subtitle: React.PropTypes.string,
			imageURL: React.PropTypes.string,
			onPress: React.PropTypes.func,
		})),
	};

	constructor(props) {
	  super(props);

    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.dataSource = this.dataSource.cloneWithRows(props.items);
    this.list = props.items;

	}

  componentWillReceiveProps(nextProps) {
      this.dataSource = this.dataSource.cloneWithRows(nextProps.items);
      this.list = nextProps.items;
  }

  onScrollBeginDrag = e => {
    const { contentOffset } = e.nativeEvent;
    this.startDragWidth = contentOffset.x;
  }

	onScrollEndDrag = e => {
    const {contentOffset} = e.nativeEvent;
    this.endDragWidth = contentOffset.x;
    let contentSizeWidth = e.nativeEvent.contentSize.width
    let oriageScrollWidth = e.nativeEvent.layoutMeasurement.width;
    const {dragWidth} = this.props;
    let width = dragWidth + 15;

    if ((this.endDragWidth > contentSizeWidth-oriageScrollWidth) || ( this.list.length <= 1)) {
      return;
    }

    // 左划
    if (this.startDragWidth < this.endDragWidth) {

        if ( this.endDragWidth%width < width/5 ) {
          this.refs.scrollView.scrollTo({
            x: this.endDragWidth - this.endDragWidth%width,
            y: 0,
            animated: true
          });
        } else {
          this.refs.scrollView.scrollTo({
            x: this.endDragWidth - this.endDragWidth%width  + width,
            y: 0,
            animated: true
          });
        }

        // 右划
    } else {

        if ( this.endDragWidth % width < width/5 * 4 ) {
          this.refs.scrollView.scrollTo({
            x: this.endDragWidth - this.endDragWidth%width,
            y: 0,
            animated: true
          });
        } else {
          this.refs.scrollView.scrollTo({
            x: this.endDragWidth - this.endDragWidth%width + width,
            y: 0,
            animated: true
          });
        }
    }
	}


	render() {
		return(
			<ListView
        style={this.props.style}
				ref='scrollView'
				centerContent={false}
        dataSource= {this.dataSource}
        renderRow={this.renderItem.bind(this)}
        onScrollBeginDrag={this.onScrollBeginDrag}
				onScrollEndDrag={this.onScrollEndDrag}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
        renderFooter={this.renderFooter.bind(this)}
			/>

		);
	}

  renderItem(item, section, row) {
	  if(row < "5") {
      return (
        <BannerItem
          index={parseInt(row)}
          allowStyle={this.props.allow}
          videoCenterButtonStyle={this.props.videoCenterButton}
          mainTitleStyle={this.props.mainTitle}
          subTitleStyle={this.props.subTitle}
          imageStyle={this.props.image}
          headStyle={this.props.headStyle}
          category={this.props.category}
          mainTitle={item.title}
          subTitle={item.subtitle}
          imageURL={item.imageURL}
          head_url={item.head_url}
          video_url={item.video_url}
          onPress={item.onPress}
          onPressAvatar={item.onPressAvatar}
        />
      )
    }else if(row === "5") {
	    return (
        <TouchableOpacity key={3} activeOpacity = {0.8} onPress={() => this.props.onPressShowAll()} >
          <Image source={require("./images/show_all@2x.png")} style={this.props.showAllStyle}/>
        </TouchableOpacity>
      )
    }else {
	    return (
	      <View/>
      )
    }
  }

  renderFooter() {
	  if(this.list.length < 5) {
	    return (
        <View style={this.props.showAllStyle}/>
      )
    }
  }

}

class BannerItem extends Component {

	constructor(props) {
	  super(props);
	}

	render() {
		return (
			<TouchableOpacity activeOpacity = {0.8} style={(this.props.index===0)?itemStyles.containerFirst:itemStyles.container} onPress={() => this.props.onPress(this.props.index)}>
        <RCImage
          uri={this.props.imageURL}
          style={this.props.imageStyle}
        >
          <Image source={require("./images/small_arrow@2x.png")} style={this.props.allowStyle} />
          {this.renderCenterButton()}
        </RCImage>

        <View style={{flexDirection: "row"}}>
          {this.renderHeadImage()}
          <View>
            <Text numberOfLines={1} style={this.props.mainTitleStyle}>{this.props.mainTitle}</Text>
            <Text numberOfLines={1} style={this.props.subTitleStyle}>{this.props.subTitle}</Text>
          </View>
        </View>

			</TouchableOpacity>
		);
	}

  renderCenterButton() {

	  if(this.props.video_url)
    return (
      <TouchableOpacity activeOpacity = {0.8} style={this.props.videoCenterButtonStyle} onPress={() => this.props.onPress(this.props.index)}>
        <Image source={require("./images/cenerPlay@2x.png")} style={{width: 40,height: 40,backgroundColor: 'transparent'}}/>
      </TouchableOpacity>
    )
  }

  renderHeadImage() {
	  if(this.props.category === "runner") {
      return(
        <TouchableOpacity activeOpacity = {0.8} onPress={() => this.props.onPressAvatar(this.props.index)}>
          <Image source={this.props.head_url ? {uri: this.props.head_url} : require("./images/avator@2x.png")} style={this.props.headStyle}/>
        </TouchableOpacity>
      )
    }
  }
}

const itemStyles = StyleSheet.create({
	container: {
		marginRight: 15,
	},
	containerFirst: {
		marginRight: 15,
		marginLeft: 15,
	}
});

const scrollViewStyles = StyleSheet.create({
	scrollView: {
		flexDirection: 'row',
	},
});
