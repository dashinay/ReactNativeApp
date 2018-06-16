import React from 'react';
import { Image, AppRegistry, FlatList, ActivityIndicator, StyleSheet, Button, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
	static navigationOptions = {
    title: 'React Native App',
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Go to Cameras"
          onPress={() => this.props.navigation.navigate('Cameras')}
        />
      </View>
    );
  }
}

class Cameras extends React.Component {
  static navigationOptions = {
    title: 'Cameras',
  };

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('https://web6.seattle.gov/Travelers/api/Map/Data?zoomId=17&type=2')
      .then((response) => response.json())
      .then((responseJson) => {
		var output = {cameras: []};
        this.setState({
          isLoading: false,
          dataSource: responseJson.Features,
		  dataDisplay: output
        }, function(){
			var data = this.state.dataSource;
			for(var feature in data){
				
				var cameras = data[feature].Cameras;
				for(var camera in cameras){
					var url = "";
					if(cameras[camera].Type == ('sdot')){
						url = 'http://www.seattle.gov/trafficcams/images/' + cameras[camera].ImageUrl;
					}
					else{
						url = 'http://images.wsdot.wa.gov/nw/' + cameras[camera].ImageUrl;
					}
					console.log(cameras[camera]);
					this.state.dataDisplay.cameras.push({description: cameras[camera].Description, url: url});
				}
			}
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  render() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={{flex: 1, paddingTop:1}}>
        <FlatList
          data={this.state.dataDisplay.cameras}
          renderItem={({item}) => 
		  <View style = {{flex:1, flexDirection: 'row'}}>
		  <Image source = {{ uri: item.url }} style={{width: '50%',
														height: 120 ,
														margin: 6}} />
		  <Text style={{width:'50%', 
						textAlignVertical:'center', padding: 6}}>{item.description}</Text>
		  </View>}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Cameras: Cameras,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
