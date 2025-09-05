'use server'
import { revalidateTag } from 'next/cache'

export default async function revalidateAction() {
    revalidateTag('homePageLayoutData');//the tag of revalidation
}
