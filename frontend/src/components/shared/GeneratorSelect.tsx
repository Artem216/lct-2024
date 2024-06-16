import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IConstant } from '@/constants';

interface GeneratorSelectProps {
    selectTitle: string;
    selectValues?: IConstant[];
    selectStringValues?: string[];
    onSelectChange: (value: string) => void;
}


const GeneratorSelect: React.FC<GeneratorSelectProps> = ({ onSelectChange, selectTitle, selectValues, selectStringValues }) => {

    return (
        <Select onValueChange={(value) => {
            if (value === " ") onSelectChange("");
            else onSelectChange(value);
        }}>
            <SelectTrigger className="m-3 max-w-[80%]"
                style={{ color: 'black', backgroundColor: 'white' }}>
                <SelectValue placeholder={`Выбрать ${selectTitle.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'white' }}>
                <SelectGroup>
                    {selectValues &&
                        <SelectLabel>{selectTitle}</SelectLabel>}
                    {selectValues && selectValues.map((valueSelect, index) => {
                        const [key, value] = Object.entries(valueSelect)[0];
                        return (
                            <SelectItem key={index} value={key}
                                style={{ color: 'black', backgroundColor: 'white', cursor: 'pointer' }}>{value}</SelectItem>
                        )
                    })}
                    {selectStringValues &&
                        (
                            <>
                                <SelectItem value={" "}
                                    style={{ color: 'black', backgroundColor: 'white', cursor: 'pointer' }}>{selectTitle}</SelectItem>
                            </>
                        )
                    }
                    {selectStringValues && selectStringValues.map((valueSelect, index) => {
                        return (
                            <>
                                {valueSelect !== "" &&
                                    <SelectItem key={index} value={valueSelect}
                                        style={{ color: 'black', backgroundColor: 'white', cursor: 'pointer' }}>{valueSelect}</SelectItem>}
                            </>
                        )
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default GeneratorSelect;