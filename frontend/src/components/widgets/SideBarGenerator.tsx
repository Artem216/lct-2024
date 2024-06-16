import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Input } from "../ui/input"
import GeneratorSelect from "../shared/GeneratorSelect"
import { ChannelSelectValues, ProductSelectValues, imageTypeValues, bgGenerationColors } from "@/constants"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import ApiImage from "@/services/apiImage"
import { useGeneratorImages } from "@/context/GeneratorImagesContext"
import { getRandomString, validatePromptForTags } from "@/lib/utils"
import ConfirmDialog from "../shared/ConfirmDialog"

type CheckedState = boolean | 'indeterminate';


const SideBarGenerator = () => {
    const topBarHeight = 60;
    const maxLengthSymbols = 100;
    const [lengthSymbols, setLengthSymbols] = useState(0);
    const [checkPrompt, setCheckPrompt] = useState<CheckedState>(false);
    const [checkColor, setCheckColor] = useState<CheckedState>(false);
    const [checkLLM, setCheckLLM] = useState<CheckedState>(false);
    const [openConfirmLLMDialog, setOpenConfirmDialog] = useState(false);

    const { setIsStartGeneration, setImgHeight, setImgWidth,
        setImgNumber, setGeneratedImages
    } = useGeneratorImages();


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
            .string()
            .refine(validatePromptForTags, {
                message: "Промпт должен состоять их тегов разделенных через запятую, смотрите на пример",
            }),
        imageType: z
            .string({
                required_error: "Пожалуйста выберите тип изображения",
            }),
        height: z
            .number({
                required_error: "Пожалуйста задайте высоту",
                invalid_type_error: "Введите число"
            })
            .min(20).max(2000),
        width: z
            .number({
                required_error: "Пожалуйста задайте ширину",
                invalid_type_error: "Введите число"
            })
            .min(20).max(2000),
        color: z
            .string(),
        imageNumber: z
            .string({
                required_error: "Пожалуйста задайте количество картинок",
            })
            .min(1).max(10),

    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            color: getRandomString(bgGenerationColors),
            width: 512,
            height: 512,
            imageNumber: '1',
            prompt: "",
            imageType: "megabanner"
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        let useLLM = false;
        if (checkLLM && !openConfirmLLMDialog) {
            useLLM = true;
            setOpenConfirmDialog(true);
            return;
        }
        try {
            const response = await ApiImage.generate({
                n_variants: Number(data.imageNumber),
                prompt: data.prompt,
                width: data.width,
                height: data.height,
                goal: data.channel,
                product: data.product,
                image_type: data.imageType,
                colour: data.color,
                use_llm: useLLM,

            })
            form.reset();
            setIsStartGeneration(true);
            setImgHeight(data.height);
            setImgWidth(data.width);
            setImgNumber(Number(data.imageNumber));
            setGeneratedImages(response);
        }
        catch (error) {
            return toast({
                title: "Ошибка генерации. Попробуйте снова обновив страницу",
                variant: "destructive",
            })
        }
    }

    const promptValue = form.watch('prompt');
    useEffect(() => {
        setLengthSymbols(promptValue?.length || 0);
    }, [promptValue]);

    function cancelDialogLLM() {
        setOpenConfirmDialog(false);
        setCheckLLM(false);
    }

    async function confirmDialogLLM() {
        setOpenConfirmDialog(false);
        const isValid = await form.trigger();

        if (isValid) {
            const formData = form.getValues();
            await onSubmit(formData);
        }
    }

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
                                    selectTitle="Продукт" selectValues={ProductSelectValues} />
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
                            Задать промпт
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
                                                Пример: монеты, большой дом, автомобиль
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
                    <div className="flex items-center space-x-2 ml-5 my-5">
                        <Checkbox
                            checked={checkLLM}
                            onCheckedChange={(value) => { setCheckLLM(value) }}
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Сгенерировать промпт с помощью LLM
                        </label>
                    </div>
                    <div className="flex justify-between items-center">
                        <FormField
                            control={form.control}
                            name="imageType"
                            render={({ field }) => (
                                <FormItem>

                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue="megabanner"
                                        className="flex flex-col space-y-1 text-black m-5"
                                    >
                                        {imageTypeValues.map((valueSelect) => {
                                            const [key, value] = Object.entries(valueSelect)[0];
                                            return (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value={key} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {value}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        })}
                                    </RadioGroup>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )}
                        />
                        <div className="w-[140px] mx-8">
                            <div>
                                <label
                                    className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Высота
                                </label>
                                <div className="flex items-center mb-2">
                                    <FormField
                                        control={form.control}
                                        name="height"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input className="shad-input text-black mt-3" type="number"
                                                        {...field} />
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />
                                    <p className="text-black ml-2">px</p>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Ширина
                                </label>
                                <div className="flex items-center">
                                    <FormField
                                        control={form.control}
                                        name="width"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input className="shad-input text-black mt-3" type="number"
                                                        {...field} />
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />
                                    <p className="text-black ml-2">px</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 items-center">
                        <div>
                            <div>
                                <div>
                                    <div className="flex items-center space-x-2 ml-5 my-5">
                                        <Checkbox
                                            checked={checkColor}
                                            onCheckedChange={(value) => { setCheckColor(value) }}
                                        />
                                        <label
                                            className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Задать цвет фона
                                        </label>
                                    </div>
                                    {checkColor &&
                                        <FormField
                                            control={form.control}
                                            name="color"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                className="ml-5"
                                                                type="color"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                style={{ cursor: 'pointer', width: '60px', height: '40px' }}
                                                            />
                                                            <label
                                                                className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                            >
                                                                Цвет фона
                                                            </label>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                </div>

                                <div className="mt-3 ml-5">
                                    <label
                                        className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Количество картинок
                                    </label>
                                    <div className="flex items-center w-[100px]">
                                        <FormField
                                            control={form.control}
                                            name="imageNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input className="shad-input text-black mt-3" type="number"
                                                            {...field} />
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex mt-5 flex-col justify-end items-end gap-4">
                        <div>
                            <Button className="shad-button_secondary px-5 w-[200px]">
                                Загрузить датасет
                            </Button>
                        </div>
                        <div>
                            <Button type="submit" className="shad-button_primary px-5 w-[200px]">
                                Сгенерировать
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
            <ConfirmDialog
                open={openConfirmLLMDialog}
                title={'Использовать LLM для генерации промпта'}
                description={'Обратите внимание, время на генерацию картинки немного увеличится, так как сначала применится LLM. Применить LLM?'}
                onConfirm={confirmDialogLLM}
                onCancel={cancelDialogLLM}
            />
        </div>
    )
}

export default SideBarGenerator