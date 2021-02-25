import React from 'react'; 
import firebase from'firebase/app'; 
import 'firebase/firestore'; 
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId:  process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSEGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID  
})
const auth = firebase.auth(); 
const firestore = firebase.firestore();
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <section>
        <>{process.env.REACT_APP_apiKey}</>
        {user ? <MainPage/> : <SignInPage/>}
      </section>
    </div>
  );
}

function SignInPage() { 
  const signInWithGoogle = () => { 
    const provider = new firebase.auth.GoogleAuthProvider(); 
    auth.signInWithPopup(provider);
  }
  return (

    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() { 
  return auth.currentUser && (
      <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function MainPage() { 
  const [input, setInput] = React.useState("");
  const linkRef = firestore.collection('links');
  const query = linkRef.where('uid', '==', auth.currentUser.uid).limit(10);
  const [links] = useCollectionData(query, {idField: 'id'});
  const sendInput = async(e) => { 
    e.preventDefault(); 
    const { uid } = auth.currentUser;
    await linkRef.add({
      text: input, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
      uid,
    })
    setInput('');
  }
  return (
    <div>
      Add your new link here!
      <form onSubmit={sendInput}>
        <input value={input} onChange={(e) => setInput(e.target.value)}/>
        <button type="submit" >ADD</button>
      </form>
      Recent adds 
      {links && links.map(link => <Link key={link.id} link={link}/>)}
      <SignOut/>
    </div>
  )
} 

function Link(props) { 
  const {text, uid} = props.link;
  return <p>{text}</p>
}
export default App;
