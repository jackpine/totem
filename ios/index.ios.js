var MOCKED_MOVIES_DATA = [
      {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];

var {
    AppRegistry,
    Image,
    StyleSheet,
    Text,
    View,
} = React;

render: function() {
    var movie = MOCKED_MOVIES_DATA[0];
    return (
        <View style={styles.container}>
        <Text>{movie.title}</Text>
        <Text>{movie.year}</Text>
        <Image source={{uri: movie.posters.thumbnail}} />
        </View>
    );
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
});


<Image
  source={{uri: movie.posters.thumbnail}}
  style={styles.thumbnail}
/>
