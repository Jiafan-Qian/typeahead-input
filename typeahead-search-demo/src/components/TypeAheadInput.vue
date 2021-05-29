<template>
  <div>
    <input type="text" id="typeahead" size="30" v-model="state" 
    @input="findSuggestions" placeholder="Please Enter a US State Name" />
    <div v-show="isOpen" id="dropdown-list">
      <div id="no-result" v-show="suggestions.length==0">
        No result found.
      </div>
      <div class="suggestion-block" v-for="suggestion in suggestions" 
      :key="suggestion.abbreviation"
      @click="selectState(suggestion)">
        <div v-html="highlightMatch(suggestion.name)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios' //used for handling HTTP requests

const API_URL = "http://localhost:4000/graphql";

export default {
  name: 'TypeAheadInput',
  data() {
    return {
      state: "",
      states: [],
      suggestions: [],
      isOpen: false //determine the visibitlity of suggestions block
    }
  },
  //get all US states when the component is mounted
  async mounted() {
    try {
        const res = await axios.post(
          API_URL, {
          query: `{ 
            allStates{
              name,
              abbreviation
            }
          }`
        })
        this.states= res.data.data.allStates
      } catch (e) {
        console.log('err', e)
      }
  },
  methods: {
    //filter all the suggestions that have the user input content
    findSuggestions() {
      if (this.state){
        this.suggestions = this.states.filter(i => i.name.toLowerCase().includes(this.state.toLowerCase()));
        this.isOpen = true;
      }
      else{
        this.suggestions = [];
        this.isOpen = false;
      }
      
    },
    
    //fill the input field with user-clicked state in the suggestion block
    selectState(item){
      this.state = item.name;
      this.isOpen = false;
    },
    
    //highlight the user input part in the State name
    highlightMatch(text){
      return text.replace(new RegExp(this.state, 'gi'), match => {
        return '<strong>' + match + '</strong>';
      });
    }
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#typeahead {
  font-size: 20px;
  border: 1px solid black;
  width: 30%;
}

#dropdown-list {
  border: 1px solid black;
  width: 30%;
  height: auto;
  max-height: 300px;
  margin: auto;
  font-size: 20px;
  overflow: auto;
}

.suggestion-block, #no-result {
  font-size: 20px;
  
}

.suggestion-block:hover {
  background-color: skyblue;
  cursor: pointer;
}
</style>
