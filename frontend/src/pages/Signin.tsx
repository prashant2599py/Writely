import { Auth } from "../components/Auth"
import { Quote } from "../components/Quote"
import { motion } from "framer-motion"

export const Signin = () => {

    return <div className="grid grid-cols-1 lg:grid-cols-2">
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 10 }}
            transition={{ duration: 1, delay: 0.6 }}
        >
            <Auth type="signin" />
        </motion.div>
        <motion.div className="hidden lg:block"
            // animate={{ rotate: 360 }}
            
        >
            <Quote />
        </ motion.div>
    </div>
}