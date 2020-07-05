import Vue from "vue";
import Vuex from "vuex";
import { firebase, db} from '../Common/firebase';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {},
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        initFirebase ({ commit }) {
            firebase.auth().onAuthStateChanged(
                async (user) => {
                    if (user) {
                        commit('setUser', user);
                        const userDbRef = db.collection('users').doc(user.uid);
                        await userDbRef.set({
                            displayName: user.displayName,
                            photoURL: user.photoURL
                        });
                    }
                }
            );
        }
    },
    modules: {},
    getters: {
        user: state => state.user,
    }
});
