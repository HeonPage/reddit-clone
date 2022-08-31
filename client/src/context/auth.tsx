import axios from "axios"
import { createContext, useContext, useEffect, useReducer } from "react"
import { User } from "../types"

interface State {
    authenticated: boolean
    user: User | undefined
    loading: boolean
}

const StateContext = createContext<State>({
    authenticated: false,
    user: undefined,
    loading: true,
})

interface Action {
    type: string
    payload: any
}
const DispatchContext = createContext<any>(null)

const reducer = (state: State, { type, payload }: Action) => {
    switch (type) {
        case "LOGIN":
            return {
                ...state,
                authenticated: true,
                user: payload
            }
        case "LOGOUT":
            return {
                ...state,
                authenticated: false,
                user: null
            }
        case "STOP_LOADING":
            return {
                ...state,
                loading: false
            }
        default:
            throw new Error(`Unknown action type: ${type}`)
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, defaultDispatch] = useReducer(reducer, {
        authenticated: false,
        user: null,
        loading: true
    })

    console.log('state', state)

    const dispatch = (type: string, payload?: any) => {
        defaultDispatch({ type, payload })
    }

    // useEffect(() => {
    //     async function loadUser() {
    //         try {
    //             const res = await axios.get("/auth/me");
    //             dispatch("LOGIN", res.data);
    //         } catch (error) {
    //             console.log(error)
    //         } finally {
    //             dispatch("STOP_LOADING");
    //         }
    //     }
    //     loadUser();
    // }, [])

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);