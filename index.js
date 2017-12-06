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
} from 'react-native';
import RCC from "../../app/model/RCConst";

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

	  this.state = {
	  	items: this.props.items,
	  };
	}

	onScrollEndDrag = e => {
    const { contentOffset } = e.nativeEvent;

    if (contentOffset.x < (this.state.items.length-1.8) * (260+15) && (this.state.items.length > 1)) {
	    if (contentOffset.x%(260+15) < (265+15)/2 ) {
	    	this.refs.scrollView.scrollTo({x: contentOffset.x-contentOffset.x%(260+15), y: 0, animated: true});
	    } else {
	    	this.refs.scrollView.scrollTo({x: (contentOffset.x-contentOffset.x%(260+15))+(260+15), y: 0, animated: true});
	    }
	  } else {
	  	if (contentOffset.x >= (this.state.items.length-1.8) * (260+15) && (this.state.items.length > 1)) {
	  		this.refs.scrollView.scrollTo({x: (this.state.items.length*(260+15) - Dimensions.get('window').width)+15, y: 0, animated: true});
	  	} else if (this.state.items.length <= 1) {
	  		this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true});
	  	}
	  }
  }

	render() {

		var bannerItems = [];

		for (let i = 0; i < this.state.items.length; i++) {
			bannerItems.push(
				<BannerItem
					key={"bannerItem"+i}
					index={i}
          allowStyle={this.props.allow}
          videoCenterButtonStyle={this.props.videoCenterButton}
          mainTitleStyle={this.props.mainTitle}
          subTitleStyle={this.props.subTitle}
          imageStyle={this.props.image}
          mainTitle={this.state.items[i].title}
          subTitle={this.state.items[i].subtitle}
					imageURL={this.state.items[i].imageURL}
					onPress={this.state.items[i].onPress}
				/>
			);
		}

		if (bannerItems.length === 0) {
			bannerItems.push(
				<View key='empty' style={[itemStyles.containerFirst, itemStyles.itemSize]}>
					<Text>
						这里什么也没有
					</Text>
				</View>
			);
		}

		if (bannerItems.length === 1) {
			bannerItems.push(
				<View key='holder' style={[itemStyles.container, itemStyles.itemSize, itemStyles.emptyItem]}/>
			);
		}

		return(
			<ScrollView
				ref='scrollView'
				centerContent={false}
				onScrollEndDrag={this.onScrollEndDrag}
				contentContainerStyle={scrollViewStyles.scrollView}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
			>
				{bannerItems}
			</ScrollView>
		);
	}

}

class BannerItem extends Component {

	constructor(props) {
	  super(props);
	}

	render() {
		return (
			<TouchableOpacity style={(this.props.index===0)?itemStyles.containerFirst:itemStyles.container} onPress={() => this.props.onPress(this.props.index)}>
				<Image
	        style={this.props.imageStyle}
	        source={{uri: this.props.imageURL}}
        >
          <Image source={require("./images/small_arrow@2x.png")} style={this.props.allowStyle}/>
          {this.renderCenterButton()}
        </Image>

        <Text numberOfLines={1} style={this.props.mainTitleStyle}>{this.props.mainTitle}</Text>
        <Text numberOfLines={1} style={this.props.subTitleStyle}>{this.props.subTitle}</Text>
			</TouchableOpacity>
		);
	}

  renderCenterButton() {
    return (
      <TouchableOpacity activeOpacity = {0.8} style={this.props.videoCenterButtonStyle}>
        <Image source={require("./images/cenerPlay@2x.png")} style={{width: RCC.Color.px(40),height: RCC.Color.px(40),backgroundColor: 'transparent'}}/>
      </TouchableOpacity>
    )
  }
}

const itemStyles = StyleSheet.create({
	emptyItem: {
		backgroundColor: 'transparent',
	},
	container: {
		marginRight: 15,
	},
	containerFirst: {
		marginRight: 15,
		marginLeft: 15,
	},
  mainTitle: {
	  width: 260,
	  fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 15
  },
  subTitle: {
    width: 260,
	  fontSize: 12,
    color: '#666666',
    marginTop: 10
  },
	image: {
		height: 195,
		width: 260,
	}
});

const scrollViewStyles = StyleSheet.create({
	scrollView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});
