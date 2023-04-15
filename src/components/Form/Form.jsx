import React, {useCallback, useEffect, useState} from 'react';
import './Form.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useTelegram} from "../hooks/useTelegram";
const Form = () => {
    const field_projects = {
        ComberWay: {value: "Delta" },
        BridgeView: {value: "NV" },
        Horizons: {value: "BBy" },
    };

    const [field_project, setProject] = useState('');
    const [field_hours, setHours] = useState('');
    const [field_date, setDate] = useState(new Date());
    const [field_location, setLocation] = useState('');
    const [checkbox_cleanup, setCleanup] = useState(true);
    const [checkbox_growth, setGrowth] = useState(false);
    const [checkbox_mowing, setMowing] = useState(false);
    const [checkbox_mechanical, setMechanical] = useState(false);
    const [checkbox_aerification, setAerification] = useState(false);
    const [checkbox_blowing, setBlowing] = useState(true);
    const [checkbox_fertilization, setFertilization] = useState(false);
    const [checkbox_liming, setLiming] = useState(false);
    const [checkbox_weeding1, setWeeding1] = useState(false);
    const [checkbox_weeding2, setWeeding2] = useState(true);
    const [checkbox_weeding3, setWeeding3] = useState(false);
    const [checkbox_weeding4, setWeeding4] = useState(false);
    const [field_extra, setExtra] = useState('');
    const [field_comments1, setComments1] = useState('');
    const [field_comments2, setComments2] = useState('');
    const [field_signature, setSignature] = useState('NB');

    const checkboxes = [
        { label: 'Cleanup', value: checkbox_cleanup, setValue: setCleanup },
        { label: 'Growth', value: checkbox_growth, setValue: setGrowth },
        { label: 'Mowing', value: checkbox_mowing, setValue: setMowing },
        { label: 'Mechanical', value: checkbox_mechanical, setValue: setMechanical },
        { label: 'Aerification', value: checkbox_aerification, setValue: setAerification },
        { label: 'Blowing', value: checkbox_blowing, setValue: setBlowing },
        { label: 'Fertilization', value: checkbox_fertilization, setValue: setFertilization },
        { label: 'Liming', value: checkbox_liming, setValue: setLiming },
        { label: 'Weed lawns', value: checkbox_weeding1, setValue: setWeeding1 },
        { label: 'Weeding', value: checkbox_weeding2, setValue: setWeeding2 },
        { label: 'Weed bed areas', value: checkbox_weeding3, setValue: setWeeding3 },
        { label: 'Weed shrubs', value: checkbox_weeding4, setValue: setWeeding4 },
    ];

    const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            field_project, field_hours, field_date, field_location,
            checkbox_cleanup, checkbox_growth, checkbox_mowing,
            checkbox_mechanical, checkbox_aerification, checkbox_blowing, checkbox_fertilization,
            checkbox_liming, checkbox_weeding1, checkbox_weeding2, checkbox_weeding3, checkbox_weeding4,
            field_extra, field_comments1, field_comments2, field_signature
        }
        tg.sendData(JSON.stringify(data))

    }, [field_project, field_hours, field_date, field_location,
        checkbox_cleanup, checkbox_growth, checkbox_mowing, checkbox_mechanical, checkbox_aerification, checkbox_blowing, checkbox_fertilization,
        checkbox_liming, checkbox_weeding1, checkbox_weeding2, checkbox_weeding3, checkbox_weeding4,
        field_extra, field_comments1, field_comments2, field_signature])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Send'
        })
    }, [])

    useEffect(() => {
        if(!field_project || !field_date || !field_hours || !field_location || !field_signature) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [field_project, field_date, field_hours, field_location, field_signature])

    useEffect(() => {
        const comments = [];
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].value) {
                comments.push(checkboxes[i].label)
            }
        }
        setComments1(comments);
    }, [setComments1])

    useEffect(() => {
        // Если выбран проект из списка, то получаем его объект с информацией о локации
        const selectedProject = field_projects[field_project];
        // Если такой объект существует, то устанавливаем его значение field_location в качестве значения поля локации
        if (selectedProject) {
            setLocation(selectedProject.value);
        }
    }, [field_project, field_projects, setLocation]);

    const generateComments = (checkbox) => {
        const { label, value } = checkbox;

        const comments = [...field_comments1, label]
        if (value) {
            setComments1(comments);
        } else {
            let index = field_comments1.indexOf(label);
            field_comments1.splice(index, 1);
            setComments1(field_comments1);
        }
    }

    return (
        <div className={'form'}>
            <label>
                Project:
                <select value={field_project} onChange={(e) => setProject(e.target.value)}>
                    <option value="">Select a field_project</option>
                    {Object.keys(field_projects).map((field_project) => (
                        <option value={field_project} key={field_project}>
                            {field_project}
                        </option>
                    ))}
                </select>
            </label>


            <label>
                Hours:
                <input type="text" value={field_hours} onChange={(e) => setHours(e.target.value)} />
            </label>

            <label>
                Date:
                <DatePicker selected={field_date} onChange={(d) => setDate(d)} />
            </label>

            <label>
                Location:
                <input type="text" value={field_location} onChange={(e) => setLocation(e.target.value)} />
            </label>

            {checkboxes.map(({ label, value, setValue }) => (
                <label key={label}>
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                            setValue(e.target.checked);
                            generateComments({ label: label, value: e.target.checked });
                        }}
                    />
                    {label}
                </label>
            ))}



            <label>
                Extra:
                <input type="text" value={field_extra} onChange={(e) => setExtra(e.target.value)} />
            </label>

            <label>
                Comments 1:
                <input type="text" value={field_comments1} onChange={(e) => setComments1(e.target.value)} />
            </label>

            <label>
                Comments 2:
                <input type="text" value={field_comments2} onChange={(e) => setComments2(e.target.value)} />
            </label>

            <label>
                Signature:
                <input type="text" value={field_signature} onChange={(e) => setSignature(e.target.value)} />
            </label>
        </div>
    );
};

export default Form;