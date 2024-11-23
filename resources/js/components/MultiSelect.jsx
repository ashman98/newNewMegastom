import { useState } from "react";
import { Select, Option, Chip } from "@material-tailwind/react";

const MultiSelect = ({ options, label }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    // Обработчик выбора
    const handleSelect = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option)); // Удаление элемента
        } else {
            setSelectedOptions([...selectedOptions, option]); // Добавление элемента
        }
    };

    return (
        <div className="w-full">
            <Select
                label={label}
                // value={selectedOptions.join(", ")}
                onChange={() => {}} // Пустой обработчик, чтобы избежать ошибок
                multiple={true}  // Важно: Устанавливает поддержку множественного выбора
                placeholder="Выберите опции"
            >
                {options.map((option) => (
                    <Option key={option.id} onClick={() => handleSelect(option.title)}>
                        <div className="flex items-center gap-2">
                            {/* Галочка при выборе */}
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option.title)}
                                className="w-4 h-4 accent-blue-500"
                                readOnly
                            />
                            <span>{option.title}</span>
                        </div>
                    </Option>
                ))}
            </Select>

            {/* Отображение выбранных элементов */}
            <div className="flex flex-wrap gap-2 mt-3">
                {selectedOptions.map((option, index) => (
                    <Chip
                        key={index}
                        value={option}
                        onClose={() => handleSelect(option)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MultiSelect;
