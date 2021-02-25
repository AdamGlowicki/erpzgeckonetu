import React, {Fragment} from 'react';
import styled, {css} from 'styled-components';
import ColorPickerButton from "../colorPicekButton/ColorPickerButton";

const StyledWrapper = styled.div`
 position: ${props => props.add ? 'static' : 'absolute'};
 top: 4px;
 right: 4px;
 padding: 8px;
 width: 150px;
 max-height: 80%;
 border-radius: 8px;
 display: flex;
 flex-direction: column;
 justify-content: flex-start;
 align-items: center;
 z-index: 9999;
 background-color: whitesmoke;
 border: 1px solid grey;
 box-shadow: 9px 9px 20px -9px rgba(0,0,0,0.75);
  overflow-x: visible;
  overflow-y: scroll;
  &::-webkit-scrollbar{
  width: 5px;
  }
  &::-webkit-scrollbar-track {
  background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
  background: #ac0;
  }
`

const StyledInput = styled.input`
  border: none;
  border-radius: 4px;
  background-color: yellowgreen;
  font-size: 12px;
  width: 120px;
  &:focus {
    outline: none
  }
`

const StyledSelect = styled.select`
 border: none;
 border-radius: 4px;
 background-color: yellowgreen;
 font-size: 12px;
 width: 120px;
 &:focus {
    outline: none
 }
 &::-webkit-scrollbar{
  height: 5px;
  width: 5px;
  }
  &::-webkit-scrollbar-track {
  background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
  background: #ac0;
  }
`

const StyleLabel = styled.label.attrs(props => ({
    htmlFor: props.htmlFor,
}))`
    display: flex;
    align-self: flex-start;
    margin-bottom: 0;
    font-size: 12px;
    font-weight: 600;
`

const StyledForm = styled.fieldset`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledButton = styled.button`
  background-color: yellowgreen;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
`

const GraphControls = ({style: propsStyle, handleStyle, cloneElement, elementId, open: openElements, setOpen: setOpenElements, label, setLabel, add, openPermission, setOpenPermission, adminPermission}) => {
    const {width, height, backgroundColor, radius, borderSize, borderType, borderColor, fontSize, fontWeight, color, rotate} = propsStyle;

    const returnUdfIfNull = (value) => (
        value === null ? undefined : value
    )

    return (
        <StyledWrapper add={add}>
                <StyledForm disabled={returnUdfIfNull(!elementId)}>
                    {!add ? (
                        <Fragment>
                            <StyleLabel htmlFor='label'>Etykieta</StyleLabel>
                            <StyledInput
                                id='label'
                                type='text'
                                value={returnUdfIfNull(label)}
                                onChange={setLabel}
                            />
                        </Fragment>
                    ) : null}

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='width'>Szerokość</StyleLabel>
                    <StyledInput
                        min='0'
                        step='10'
                        id='width'
                        type='number'
                        name='width'
                        value={returnUdfIfNull(width)}
                        onChange={handleStyle}
                    />

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='height'>Wysokość</StyleLabel>
                    <StyledInput
                        min='0'
                        step='10'
                        id='height'
                        type='number'
                        name='height'
                        value={returnUdfIfNull(height)}
                        onChange={handleStyle}
                    />

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='backgroundColor'>Kolor tła</StyleLabel>
                    <ColorPickerButton
                        color={returnUdfIfNull(backgroundColor)}
                        name='backgroundColor'
                        handleStyle={handleStyle}
                    />

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='radius'>Zaokrąglenie</StyleLabel>
                    <StyledInput
                        min='0'
                        step='2'
                        id='radius'
                        type='number'
                        name='radius'
                        value={returnUdfIfNull(radius)}
                        onChange={handleStyle}
                    />

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='borderSize'>Szerokość ramki</StyleLabel>
                    <StyledInput
                        min='0'
                        id='borderSize'
                        type='number'
                        name='borderSize'
                        value={returnUdfIfNull(borderSize)}
                        onChange={handleStyle}
                    />

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='borderType'>Styl ramki</StyleLabel>
                    <StyledSelect
                        id='borderType'
                        type='select'
                        name='borderType'
                        value={returnUdfIfNull(borderType)}
                        onChange={handleStyle}
                        second
                    >
                        <option value='solid'>Jednolity</option>
                        <option value='dotted'>Kropki</option>
                        <option value='dashed'>Kreski</option>
                        <option value='double'>Podwójny</option>
                    </StyledSelect>

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='borderColor'>Kolor ramki</StyleLabel>
                    <ColorPickerButton
                        color={returnUdfIfNull(borderColor)}
                        name='borderColor'
                        handleStyle={handleStyle}
                    />

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='fontSize'>Rozmiar czcionki</StyleLabel>
                    <StyledInput
                        min='0'
                        id='fontSize'
                        type='number'
                        name='fontSize'
                        value={returnUdfIfNull(fontSize)}
                        onChange={handleStyle}
                    />

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='fontWeight'>Pogrubienie</StyleLabel>
                    <StyledSelect
                        id='fontWeight'
                        type='number'
                        name='fontWeight'
                        value={returnUdfIfNull(fontWeight)}
                        style={{fontWeight: propsStyle.fontWeight}}
                        onChange={handleStyle}
                        second
                    >
                        <option value={100} style={{fontWeight: 100}}>Najcieńsza</option>
                        <option value={200} style={{fontWeight: 200}}>Cieńsza</option>
                        <option value={300} style={{fontWeight: 300}}>Cienka</option>
                        <option value={400} style={{fontWeight: 400}}>Normalna</option>
                        <option value={500} style={{fontWeight: 500}}>Lekko pogrubiona</option>
                        <option value={600} style={{fontWeight: 600}}>Pogrubiona</option>
                        <option value={700} style={{fontWeight: 700}}>Gruba</option>
                        <option value={800} style={{fontWeight: 800}}>Grubsza</option>
                        <option value={900} style={{fontWeight: 900}}>Najgrubsza</option>
                    </StyledSelect>

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='color'>Kolor czcionki</StyleLabel>
                    <ColorPickerButton
                        color={returnUdfIfNull(color)}
                        name='color'
                        handleStyle={handleStyle}
                    />

                    <div className='mt-2'/>
                    <StyleLabel htmlFor='rotate'>Obrót</StyleLabel>
                    <StyledInput
                        step='5'
                        id='rotate'
                        type='number'
                        name='rotate'
                        value={returnUdfIfNull(rotate)}
                        onChange={handleStyle}
                    />
                </StyledForm>

                {!add ? (
                    <div>
                        <div className='mt-4'/>
                        <StyledButton disabled={!elementId} onClick={cloneElement}>Klonuj element</StyledButton>

                        <div className='mt-2'/>
                        <StyledButton onClick={() => setOpenElements(!openElements)}>Dodaj element</StyledButton>

                        <div className='mt-2'/>
                        {adminPermission && (<StyledButton onClick={() => setOpenPermission(!openPermission)}>Uprawnienia</StyledButton>)}
                    </div>
                ) : null}
        </StyledWrapper>
    );
};

export default GraphControls;

