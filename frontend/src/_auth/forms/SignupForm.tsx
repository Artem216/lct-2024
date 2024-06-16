import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useForm } from "react-hook-form"
import { SignupValidationSchema } from "@/lib/validation"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useUserContext } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import ApiAuth from "@/services/apiAuth"


const SignupForm = () => {
  const { toast } = useToast();
  const { setIsAuth } = useUserContext();
  const navigate = useNavigate();



  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidationSchema>>({
    resolver: zodResolver(SignupValidationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidationSchema>) {
    try {
      await ApiAuth.singUpUser({
        email: values.email,
        password: values.password,
        name: values.name
      })
      setIsAuth(true);
      form.reset();
      navigate('/');
    }
    catch (error) {
      return toast({
        title: "Ошибка регистрации. Попробуйте снова",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-col bg-secondary-500 py-10 px-8 rounded-[60px] drop-shadow-2xl">
        <p className="base-regular md:h3-regular pt-3 text-dark-1 text-left mb-3">Регистрация</p>

        <form onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4 md:max-w-96 text-dark-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="ФИО" className="shad-input"{...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" className="shad-input"{...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Пароль" className="shad-input"{...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_repeat"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Повторите пароль" className="shad-input"{...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <div className="flex justify-between px-[5%] mt-2">
            <p className="text-small-regular text-dark-1 text-center mt-2">
              <Link to="/sign-in" className="text-dark-1 underline text-small-semibold ml-1">Войти</Link>
            </p>
            <Button type="submit" className="shad-button_primary px-[15%]">
              Зарегистрироваться
            </Button>
          </div>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm