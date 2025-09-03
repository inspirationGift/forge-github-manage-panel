import React from 'react';
import { apiService } from '../../services/apiService';
import {
    Form,
    FormHeader,
    FormSection,
    FormFooter,
    Label,
    RequiredAsterisk,
    Textfield,
    Button,
    useForm,
    HelperMessage
} from "@forge/react";

export const ManageApiKey = ({ onSuccess }) => {
    const { handleSubmit, register, getFieldId } = useForm();

    const tokenData = async (data) => {
        await apiService.saveApiKey(data.token);
        onSuccess?.();
    };

    return (
        <Form onSubmit={handleSubmit(tokenData)} maxWidth="25rem">
            <FormHeader title="Add GitHub API Token">
                Required fields are marked with an asterisk <RequiredAsterisk />
            </FormHeader>
            <FormSection>
                <Label labelFor={getFieldId("token")}>
                    Token
                    <RequiredAsterisk />
                </Label>
                <Textfield {...register("token", { required: true })} />
                <HelperMessage>
                    Please provide API token.
                </HelperMessage>
            </FormSection>
            <FormFooter>
                <Button appearance="primary" type="submit">
                    Add token
                </Button>
            </FormFooter>
        </Form>

);
};