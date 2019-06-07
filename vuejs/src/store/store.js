import Vue from 'vue';
import Vuex from 'vuex';

import program from './modules/program';
import events from './modules/events';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        program,
        events
    }
});