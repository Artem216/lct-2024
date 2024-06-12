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
    selectValues: IConstant[];
    onSelectChange: (value: string) => void;
}

const GeneratorSelect: React.FC<GeneratorSelectProps> = ({ onSelectChange, selectTitle, selectValues }) => {

    return (
        <Select onValueChange={(value) => {
            onSelectChange(value);
        }} >
            <SelectTrigger className="w-[180px]" style={{ color: 'black' }}>
                <SelectValue placeholder={`Выбрать ${selectTitle.toLowerCase()}`}/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{selectTitle}</SelectLabel>
                    {selectValues.map((valueSelect, index) => {
                        const [key, value] = Object.entries(valueSelect)[0];
                        return (
                            <SelectItem key={index} value={key} style={{ color: 'black' }}>{value}</SelectItem>
                        )
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default GeneratorSelect;