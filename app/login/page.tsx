"use client";
import {signIn,signOut,useSession} from 'next-auth/react';

export default function (){
    const {data:session} = useSession();
    if(session){
        return (
            <div>
                <h1>Welcome {session.user?.email}</h1>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        )
    }
    return (
        <div>
            <h1>Sign In</h1>
            <button onClick={()=> signIn('google')}>Login with Google</button>
        </div>
    )
}
