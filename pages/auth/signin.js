import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import Layout from "../../components/layout/layout"
import { SET_NAVBAR_TITLE } from "../../state/actions"
import styles from '../../styles/Auth.module.scss'
import Link from 'next/link'


const SignIn = ()=>{

    const dispatch = useDispatch()
    
    useEffect(()=>{
        dispatch({type:SET_NAVBAR_TITLE,payload: 'Welcome'})
    },[])

    return (
        <Layout title='Sign in'>

            <section className={styles.main}>
                <form>
                    <label for='email'>Email</label>
                    <input type='email' id='email'/>
                    <label for='password'>Password</label>
                    <input type='password' id='password'/>
                    
                    <div className={styles.group1}>
                        <p>Sign in</p>
                        <button>
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </button>
                    </div>
                    <div className={styles.group2}>
                        <Link href='/auth/signup'><p>Sign up</p></Link>
                        <Link href='/auth/forgot_password'><p>Forgot password</p></Link>
                    </div>
                </form>
            </section>

        </Layout>
    )
}

export default SignIn