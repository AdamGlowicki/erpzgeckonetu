import React, {useEffect, useState} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {getData} from "../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import InputText from "../inputText/InputText";
import ViewToAsyncSelect from "../viweToAsyncSelect/ViewToAsyncSelect";

const AsyncSelect = ({url, setSelected, value}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [search, setSearch] = useState('')
    const [selectedValue, setSelectedValue] = useState('')

    const [cookies, setCookie] = useCookies(['name'])


    const asyncSearch = async () => {
        setDisabled(true)
        try {
            const response = await getData(`${url}/${search}`, cookies);
            setOptions(response.data.data ? response.data.data : [])

        } catch (e) {

        }
        setDisabled(false)
    }

    useEffect(() => {
        let handler = setTimeout(asyncSearch, 500)

        return () => {
            clearTimeout(handler)
        };
    }, [search]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            id="asynchronous-demo"
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => {
                return option.model_name === value.model_name
            }}
            getOptionLabel={(option) => !_.isEmpty(option) ? `${option.id} ${option.model_name}` : ''}
            options={options}
            onChange={setSelected}
            value={value}
            renderInput={(params) => (
                <InputText
                    {...params}
                    value={search}
                    disabled={disabled}
                    onChange={(e) => setSearch(e.target.value)}
                    label='Wyszukaj produkt'
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
            renderOption={(options, val) => {
                return (
                    <ViewToAsyncSelect data={options}/>
                )
            }
            }
        />
    );
}

export default AsyncSelect;
