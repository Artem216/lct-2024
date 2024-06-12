import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Link } from "react-router-dom"
import { Input } from "../ui/input"
import GeneratorSelect from "../shared/GeneratorSelect"
import { ChannelSelectValues } from "@/constants"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea"

type CheckedState = boolean | 'indeterminate';


const SideBarGenerator = () => {
    const topBarHeight = 60;
    const maxLengthSymbols = 500;
    const [lengthSymbols, setLengthSymbols] = useState(0);
    const [checkPrompt, setCheckPrompt] = useState<CheckedState>(false);

    const FormSchema = z.object({
        product: z
            .string({
                required_error: "Пожалуйста выберите продукт или заполните по умолчанию",
            }),
        channel: z
            .string({
                required_error: "Пожалуйста выберите канал или заполните по умолчанию",
            }),
        prompt: z
            .string(),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    const promptValue = form.watch('prompt');
    useEffect(() => {
        setLengthSymbols(promptValue?.length || 0);
    }, [promptValue]);

    return (
        <div className="bg-primary-500/10 w-[400px] absolute top-[60px] left-0 rounded-[20px]"
            style={{ minHeight: `calc(100% - ${topBarHeight}px)` }}>
            <p className="base-regular md:base-regular text-center text-black m-2 mt-5">
                Параметры генерации изображений
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="m-5">
                    <FormField
                        control={form.control}
                        name="product"
                        render={({ field }) => (
                            <FormItem>
                                <GeneratorSelect onSelectChange={field.onChange}
                                    selectTitle="Продукт" selectValues={ChannelSelectValues} />
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="channel"
                        render={({ field }) => (
                            <FormItem>
                                <GeneratorSelect onSelectChange={field.onChange}
                                    selectTitle="Канал" selectValues={ChannelSelectValues} />
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center space-x-2 ml-5 my-5">
                        <Checkbox
                            checked={checkPrompt}
                            onCheckedChange={(value) => { setCheckPrompt(value) }}
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Использовать промпт
                        </label>
                    </div>
                    {checkPrompt &&
                        <div>
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <Textarea
                                            maxLength={maxLengthSymbols}
                                            value={field.value}
                                            className="p-4 text-black min-h-[120px]"
                                            placeholder={`Введите промпт через запятую`}
                                            onChange={field.onChange}
                                        />
                                        <div className="flex items-center text-black justify-between">
                                            <p className="text-[10px] text-left text-black">
                                                Пример: монеты, большой дом, подарок
                                            </p>
                                            <p>
                                                {lengthSymbols}/{maxLengthSymbols}
                                            </p>
                                        </div>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />
                        </div>}
                    <Button type="submit"
                        className="shad-button_primary px-5 mx-auto mt-10">
                        Сгенерировать
                    </Button>
                </form>
            </Form>

        </div>
    )
}

export default SideBarGenerator