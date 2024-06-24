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
import { ChannelSelectValues, ProductSelectValues, imageTypeValues, bgGenerationColors, holidays } from "@/constants"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import ApiImage from "@/services/apiImage"
import { useGeneratorImages } from "@/context/GeneratorImagesContext"
import { getRandomString, validatePromptForTags } from "@/lib/utils"
import ConfirmDialog from "../shared/ConfirmDialog"
import { useFileUploader } from "@/context/FileUploaderContext"

type CheckedState = boolean | 'indeterminate';


const SideBarGenerator = () => {
    const topBarHeight = 60;
    const maxLengthSymbols = 1000;
    const [lengthSymbols, setLengthSymbols] = useState(0);
    const [checkPrompt, setCheckPrompt] = useState<CheckedState>(false);
    const [checkColor, setCheckColor] = useState<CheckedState>(false);
    const [checkLLM, setCheckLLM] = useState<CheckedState>(false);
    const [openConfirmLLMDialog, setOpenConfirmDialog] = useState(false);
    const [isToggled, setIsToggled] = useState(false);

    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const addTag = () => {
        if (inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const removeTag = (index: number) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const { setIsStartGeneration, setImgHeight, setImgWidth,
        setImgNumber, setGeneratedImages
    } = useGeneratorImages();

    const { file, handleFileUpload, setFile, currentClust, currentId } = useFileUploader();


    const FormSchema = z.object({
        product: z
            .string({
                required_error: "Пожалуйста выберите продукт",
            }),
        channel: z
            .string({
                required_error: "Пожалуйста выберите канал",
            }),
        holiday: z
            .string(),
        prompt: z
            .string(),
        // .refine(validatePromptForTags, {
        //     message: "Промпт должен состоять их тегов разделенных через запятую, смотрите на пример",
        // }),
        imageType: z
            .string({
                required_error: "Пожалуйста выберите тип изображения",
            }),
        height: z
            .string({
                required_error: "Пожалуйста задайте высоту",
            })
        ,
        width: z
            .string({
                required_error: "Пожалуйста задайте ширину",
            }),
        color: z
            .string(),
        imageNumber: z
            .string({
                required_error: "Пожалуйста задайте количество картинок",
            })

    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            color: getRandomString(bgGenerationColors),
            width: '512',
            height: '512',
            imageNumber: '1',
            prompt: "",
            imageType: "megabanner",
            holiday: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        let useLLM = false;
        if (checkLLM && !openConfirmLLMDialog) {
            useLLM = true;
            setOpenConfirmDialog(true);
            return;
        }
        let promptFinal = data.prompt;
        if(isToggled){
            promptFinal = tags.join(', ');
        }
        if (file) {
            try {
                const response = await ApiImage.generateFromFile({
                    n_variants: Number(data.imageNumber),
                    prompt: promptFinal,
                    width: Number(data.width),
                    height: Number(data.height),
                    goal: data.channel,
                    product: data.product,
                    image_type: data.imageType,
                    colour: data.color,
                    use_llm: Boolean(checkLLM),
                    id_user_from_csv: Number(currentId),
                    cluster_name: currentClust,
                    is_abstract: !isToggled,
                    holiday: data.holiday,
                }, file)
                form.reset();
                setIsStartGeneration(true);
                setImgHeight(Number(data.height));
                setImgWidth(Number(data.width));
                setImgNumber(Number(data.imageNumber));
                setGeneratedImages(response);
                setCheckPrompt(false);
                setCheckColor(false);
                setCheckLLM(false);
            }
            catch (error) {
                return toast({
                    title: "Ошибка генерации. Попробуйте снова обновив страницу",
                    variant: "destructive",
                })
            }
        }
        else {


            try {
                console.log(promptFinal, 'prompt')
                const response = await ApiImage.generate({
                    n_variants: Number(data.imageNumber),
                    prompt: promptFinal,
                    width: Number(data.width),
                    height: Number(data.height),
                    goal: data.channel,
                    product: data.product,
                    image_type: data.imageType,
                    colour: data.color,
                    use_llm: Boolean(checkLLM),
                    is_abstract: !isToggled,
                    holiday: data.holiday,
                })
                form.reset();
                setIsStartGeneration(true);
                setImgHeight(Number(data.height));
                setImgWidth(Number(data.width));
                setImgNumber(Number(data.imageNumber));
                setGeneratedImages(response);
                setCheckPrompt(false);
                setCheckColor(false);
                setCheckLLM(false);
            }
            catch (error) {
                return toast({
                    title: "Ошибка генерации. Попробуйте снова обновив страницу",
                    variant: "destructive",
                })
            }
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
            setCheckLLM(true);
            await onSubmit(formData);
        }
    }

    return (
        <>
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
                        <FormField
                            control={form.control}
                            name="holiday"
                            render={({ field }) => (
                                <FormItem>
                                    <GeneratorSelect onSelectChange={field.onChange}
                                        selectTitle="Праздник" selectValues={holidays} />
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
                            <div className="flex items-center space-x-2 ml-5 mb-2">
                                <button
                                    type="button"
                                    className={`relative inline-flex h-[24px] w-[44px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${isToggled
                                        ? "bg-[#0070f3]"
                                        : "bg-[#e5e7eb] border-[#e5e7eb] hover:bg-[#d1d5db] dark:bg-[#000000] dark:border-[#000000] dark:hover:bg-[#4b5563]"
                                        }`}
                                    onClick={() => setIsToggled(!isToggled)}
                                    aria-label="Toggle"
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isToggled ? "translate-x-[20px] bg-[#ffffff]" : "translate-x-0 bg-[#000000] dark:bg-[#f3f4f6]"
                                            }`}
                                    />
                                </button>
                                <span className="text-sm font-medium text-black">{!isToggled ?
                                    "Задать промпт в свободном формате" :
                                    "Задать теги - объекты, которые должны быть сгенерированы на картинке"}</span>
                            </div>}
                        {(checkPrompt && !isToggled) &&
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
                                            <div className="flex items-center text-black justify-end">
                                                <p>
                                                    {lengthSymbols}/{maxLengthSymbols}
                                                </p>
                                            </div>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                            </div>}
                        {(checkPrompt && isToggled) &&
                            <div className="w-full max-w-sm space-y-4 text-black">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Введите текст и добавьте объекты"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        // onKeyDown={(e) => {
                                        //     if (e.key === "Enter") {
                                        //         addTag()
                                        //     }
                                        // }}
                                        className="pr-16"
                                    />
                                    <p className="text-[10px] text-left text-black mt-3">
                                        Пример: монеты, большой дом, автомобиль
                                    </p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-[30%] right-3 -translate-y-1/2"
                                        onClick={addTag}
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-2 rounded-full bg-primary-500/50 px-3 py-1 text-sm font-medium"
                                        >
                                            {tag}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:bg-muted/50"
                                                onClick={() => removeTag(index)}
                                            >
                                                <XIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
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

                        <div className="flex gap-2 justify-between my-5">
                            <div>
                                <Button type="button" className="text-black border border-gray-800 px-5 w-[150px]"
                                    onClick={() => { setFile(null) }}>
                                    Удалить датасет
                                </Button>
                            </div>
                            <div>
                                <label htmlFor="file-upload" className="shad-button_secondary py-2 px-5 w-[200px] cursor-pointer
                                 rounded-tr-[15px] rounded-tl-[50px] rounded-bl-[15px] rounded-br-[50px] h-10 text-center">
                                    Загрузить датасет
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        </div>
                        <div className="flex mt-5 flex-col justify-end items-end gap-4">
                            <div>
                                <Button type="submit" className="shad-button_primary px-5 w-[200px]">
                                    Сгенерировать
                                </Button>
                            </div>
                            <p className="base-regular md:base-regular text-center text-black m-2 mt-5">
                                Перед новой генерацией, пожалуйста, перезагрузите страничку
                            </p>
                        </div>
                    </form>
                </Form>
                <ConfirmDialog
                    open={openConfirmLLMDialog}
                    title={'Использовать LLM для генерации промпта'}
                    description={'Обратите внимание, время на генерацию картинки увеличится (примерно на 2 минуты), так как сначала применится LLM. Применить LLM?'}
                    onConfirm={confirmDialogLLM}
                    onCancel={cancelDialogLLM}
                />
            </div>
            {/* <FileUploader /> */}
        </>
    )
}

export default SideBarGenerator;



function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}


function XIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}