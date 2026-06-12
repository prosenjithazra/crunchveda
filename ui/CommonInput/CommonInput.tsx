'use client';
import { styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { StandardTextFieldProps } from '@mui/material/TextField';
import React, { forwardRef, useCallback, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { InputStack } from '@/styles/StyledComponents/CommonInputStyled';

const InputWrap = styled(TextField)`
  .MuiInputBase-root {
    background-color: ${({theme}) => theme.palette.customColors.headerBg};
    min-height: 44px;
    padding: 10px 24px;
    border-radius: 10px;
    border: 1px solid ${({theme})=> theme.palette.grey[300]};
    outline: none;

    .MuiInputBase-input {
      font-size: 14px;
      color: ${({ theme }) => theme.palette.customColors?.dark};
      padding: 0;
      &::placeholder {
        color: ${({ theme }) => theme.palette.customColors?.placeText} !important;
        opacity: 1;
        -webkit-text-fill-color: ${({ theme }) => theme.palette.customColors?.placeText} !important;
      }

      &::-ms-input-placeholder {
        color: ${({ theme }) => theme.palette.customColors?.placeText} !important;
        opacity: 1;
        -webkit-text-fill-color: ${({ theme }) => theme.palette.customColors?.placeText} !important;
      }
    }

    .MuiInputAdornment-positionEnd {
      margin-left: 8px;
      .MuiIconButton-root {
        padding: 0;
      }
    }

    .MuiInputAdornment-positionStart {
      margin-right: 8px;
    }
  }

  fieldset {
    display: none;
  }
`;

type InputFieldCommonProps = StandardTextFieldProps & {
  isPassword?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

const CommonInput = forwardRef<HTMLInputElement, InputFieldCommonProps>(
  ({ isPassword = false, startAdornment, endAdornment, ...others }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = useCallback(() => {
      setShowPassword(prev => !prev);
    }, []);

    const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    }, []);

    return (
      <InputStack direction={'column'} className='input_wrap'>
        <InputWrap
          fullWidth={others.fullWidth}
          variant={others.variant ?? 'outlined'}
          type={isPassword ? (showPassword ? 'text' : 'password') : others?.type}
          slotProps={{
            input: {
              inputRef: ref,
              startAdornment: startAdornment && (
                <InputAdornment position='start'>{startAdornment}</InputAdornment>
              ),
              endAdornment: isPassword ? (
                <InputAdornment position='end' className='password-icon'>
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    disableRipple
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ) : (
                endAdornment && <InputAdornment position='end'>{endAdornment}</InputAdornment>
              ),
            },
          }}
          {...others}
        />
      </InputStack>
    );
  }
);

CommonInput.displayName = 'CommonInput';

export default CommonInput;
